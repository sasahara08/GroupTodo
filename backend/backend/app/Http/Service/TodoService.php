<?php

namespace App\Services;

use App\Models\Todo;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TodoService
{
    public function updateLock($id, bool $opened)
    {
        $todo = Todo::findOrFail($id);
        $user = Auth::user();
        $isLockUser = $todo->lock_user_id === $user->id;

        if ($opened) {
            if (!($todo->lock_time) || $todo->lock_time->diffInMinutes(now()) > 30 || $isLockUser) {
                $todo->lock_time = now();
                $todo->lock_user_id = $user->id;
                $todo->save();
                return ['is_lock' => false, 'lock_user' => $user->name];
            } else {
                $lockUser = User::find($todo->lock_user_id);
                return ['is_lock' => true, 'lock_user' => $lockUser->name];
            }
        } elseif ($isLockUser) {
            $todo->lock_time = null;
            $todo->lock_user_id = null;
            $todo->save();
            return ['is_lock' => false, 'lock_user' => ''];
        }

        return null;
    }

    public function createTodo(array $data, $file = null)
    {
        $todo = Todo::create([
            'user_id'     => Auth::id(),
            'group_id'    => $data['group_id'] ?? null,
            'title'       => $data['title'],
            'description' => $data['details'] ?? null,
            'due_date'    => $data['due_date'] ?? null,
            'image_url'   => null,
            'completed'   => false,
        ]);

        if ($file) {
            $todo->image_url = $this->uploadImage($todo->id, $file);
            $todo->save();
        }

        return Group::with('todos')->find($data['group_id']);
    }

    public function updateTodo(Todo $todo, array $data, $file = null)
    {
        $user = Auth::user();
        if ($todo->lock_user_id === $user->id) {
            throw new \Exception('サーバーエラー: 自分自身のロックで更新できない');
        }

        $todo->title       = $data['title'];
        $todo->description = $data['details'] ?? null;
        $todo->due_date    = $data['due_date'] ?? null;

        if ($file) {
            $todo->image_url = $this->uploadImage($todo->id, $file);
        } else {
            if ($todo->image_url) {
                $this->deleteImage($todo->image_url);
            }
            $todo->image_url = '';
        }

        $todo->save();

        return Group::with('todos')->find($data['group_id']);
    }

    public function deleteTodo(Todo $todo)
    {
        if ($todo->image_url) {
            $this->deleteImage($todo->image_url);
        }
        $todo->delete();
    }

    public function toggleCompleted(Todo $todo)
    {
        $todo->completed = ! $todo->completed;
        $todo->save();
    }

    private function uploadImage($todoId, $file)
    {
        $extension = $file->getClientOriginalExtension();
        $path = "todos/{$todoId}.{$extension}";
        Storage::disk('s3')->put($path, file_get_contents($file));
        return Storage::disk('s3')->url($path);
    }

    private function deleteImage($imageUrl)
    {
        try {
            $path = ltrim(parse_url($imageUrl, PHP_URL_PATH), '/');
            $bucket = config('filesystems.disks.s3.bucket');
            if (str_starts_with($path, $bucket . '/')) {
                $path = substr($path, strlen($bucket) + 1);
            }
            if (Storage::disk('s3')->exists($path)) {
                Storage::disk('s3')->delete($path);
            }
        } catch (\Exception $e) {
            Log::error("S3ファイル削除失敗: " . $e->getMessage());
        }
    }
}
