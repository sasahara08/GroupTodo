<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\TodoRequest;
use Illuminate\Support\Facades\Log;

class TodoController extends Controller
{

    /**
     * 排他ロック
     */
    public function updateLock(Request $request, $id)
    {
        try {
            $todo = Todo::find($id);
            $user = Auth::user();
            $opened = $request->boolean('opened');
            $is_lock_user = $todo->lock_user_id === $user->id;
            // 編集モーダルオープン時
            if ($opened) {
                if (!($todo->lock_time) || $todo->lock_time->diffInMinutes(now()) > 30 || $is_lock_user) {
                    // 排他ロック登録
                    $todo->lock_time = now();
                    $todo->lock_user_id = Auth::id();
                    $todo->save();
                    return response()->json(['is_lock' => false, 'lock_user' => $user->name], 201);
                } else {
                    // 排他ロック制御
                    $lock_user = User::find($todo->lock_user_id);
                    return response()->json(['is_lock' => true, 'lock_user' => $lock_user->name], 423);
                }
                // ロックユーザーがモーダルをクローズ
            } else if ($is_lock_user) {
                $todo->lock_time = null;
                $todo->lock_user_id = null;
                $todo->save();
                return response()->json(['is_lock' => false, 'lock_user' => ''], 201);
            }
            return;
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * グループ登録
     */
    public function store(TodoRequest $request)
    {
        $validatedData = $request->validated();
        $image_url = null;

        $todo = Todo::create([
            'user_id' => Auth::id(),
            'group_id' => $validatedData['group_id'] ?? null,
            'title' => $validatedData['title'],
            'description' => $validatedData['details'] ?? null,
            'due_date' => $validatedData['due_date'] ?? null,
            'image_url' => null,
            'completed' => false,
            'lock_time' => null,
            'lock_user_id' => null,
        ]);

        // 画像がアップロードされた場合の処理
        if ($request->hasFile('file')) {
            try {
                // ファイル情報を取得
                $file = $request->file('file');
                $extension = $file->getClientOriginalExtension();
                // todoのidを使ってファイル名固定
                $path = "todos/{$todo->id}.$extension";
                // $file のコンテンツを直接 put
                Storage::disk('s3')->put($path, file_get_contents($file));
                $image_url = Storage::disk('s3')->url($path);
                $todo->image_url = $image_url;
                $todo->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Image upload failed.'], 500);
            }
        }

        $group = Group::with('todos')->find($validatedData['group_id']);
        return response()->json(['todos' => $group->todos], 201);
    }

    /**
     * todoを参照
     */
    public function show($id)
    {
        $group = Group::with('todos.user')->find($id);
        if (!$group) {
            return response()->json(['message' => '不明なグループのタスクです'], 404);
        }

        $is_hostuser = $group->hostUser->id === Auth::id();

        // todos の配列に user_name と base64画像を追加
        $todosWithUserName = $group->todos->map(function ($todo) {
            $base64Image = null;

            Log::info("S3 file not found: $todo");
            if ($todo->image_url) {
                try {
                    // フルURLからパスを抽出
                    $path = parse_url($todo->image_url, PHP_URL_PATH);
                    $path = ltrim($path, '/');
                    Log::info("S3 file not found: $path");

                    // DBにバケット名付きで保存されている場合
                    $bucket = config('filesystems.disks.s3.bucket');
                    if (str_starts_with($path, $bucket . '/')) {
                        $path = substr($path, strlen($bucket) + 1);
                    }

                    if (Storage::disk('s3')->exists($path)) {
                        $contents = Storage::disk('s3')->get($path);

                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $mimeType = finfo_buffer($finfo, $contents);
                        finfo_close($finfo);

                        $base64Image = "data:$mimeType;base64," . base64_encode($contents);
                    }
                } catch (\Exception $e) {
                    Log::error('Image retrieval failed: ' . $e->getMessage());
                }
            }
            Log::info("S3 file not found: $base64Image");

            return [
                'id'          => $todo->id,
                'title'       => $todo->title,
                'description' => $todo->description,
                'due_date'    => $todo->due_date,
                'completed'   => $todo->completed,
                'is_important' => $todo->is_important,
                'image_url'   => $base64Image,
                'user_name'   => $todo->user ? $todo->user->name : null,
            ];
        });

        return response()->json([
            'group'     => $group,
            'todos'     => $todosWithUserName,
            'hostuser'  => $is_hostuser,
        ], 200);
    }

    /**
     * タスク編集
     */
    public function update(TodoRequest $request, $id)
    {
        $validatedData = $request->validated();

        $todo = Todo::findOrFail($id);
        $user = Auth::user();

        $is_lock_user = $todo->lock_user_id !== $user->id;
        if ($is_lock_user) {
            return response()->json(['message' => 'サーバーエラー'], 500);
        } else {
            $todo->lock_user_id = null;
            $todo->lock_time = null;
        }
        $todo->title = $validatedData['title'];
        $todo->description = $validatedData['details'] ?? null;
        $todo->due_date = $validatedData['due_date'] ?? null;

        // ファイルがあるときファイルも更新
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $path = "todos/{$todo->id}.$extension";
            Storage::disk('s3')->put($path, file_get_contents($file));
            $image_url = Storage::disk('s3')->url($path);
            $todo->image_url = $image_url;
        } else if (!($request->input('existingImage'))) {
            Log::info("完全削除: $request->input('existingImage')");
            $path = parse_url($todo->image_url, PHP_URL_PATH);
            $path = ltrim($path, '/');
            $bucket = config('filesystems.disks.s3.bucket');
            if (str_starts_with($path, $bucket . '/')) {
                $path = substr($path, strlen($bucket) + 1);
            }

            if (Storage::disk('s3')->exists($path)) {
                Storage::disk('s3')->delete($path);
            }

            $todo->image_url = null;
        }

        $todo->save();

        $group = Group::with('todos')->find($validatedData['group_id']);
        return response()->json(['todos' => $group->todos], 201);
    }

    /**
     * タスク削除
     */
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);

        try {
            if ($todo->image_url) {
                $path = parse_url($todo->image_url, PHP_URL_PATH);
                $path = ltrim($path, '/');
                // DBにバケット名付きで保存されている場合 → バケット部分を削除
                $bucket = config('filesystems.disks.s3.bucket');
                if (str_starts_with($path, $bucket . '/')) {
                    $path = substr($path, strlen($bucket) + 1);
                }

                if (Storage::disk('s3')->exists($path)) {
                    Storage::disk('s3')->delete($path);
                }
            }
        } catch (\Exception $e) {
            Log::error("S3ファイル削除失敗: " . $e->getMessage());
        }

        $todo->delete();

        return;
    }

    /**
     * タスク完了←→タスク未完了
     */
    public function changeCompleted($id)
    {
        $todo = Todo::findOrFail($id);

        $todo->completed = !($todo->completed);
        $todo->save();
        return;
    }
}
