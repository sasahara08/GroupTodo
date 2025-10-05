<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        // ユーザーが認証されていない場合はエラーを返す
        if (!$user) {
            return response()->json(['message' => 'ログインユーザーが存在しません'], 401);
        }

        $groups = $user->groups()->get();
        return response()->json(['user_groups' => $groups], 201);
    }

    /**
     * Display a listing of the resource.
     */
    public function getTodo()
    {
        // ログイン中のユーザーを取得し、型ヒントでUserインスタンスであることを明示
        /** @var User $user */
        $user = Auth::user();

        // ユーザーが認証されていない場合はエラーを返す
        if (!$user) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        /** @var User $user */
        $user = Auth::user();
        $groups = $user->groups()->wherePivot('is_member', true)->get();
        return response()->json(['user_groups' => $groups], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. バリデーション
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|min:2',
        ]);

        // ログイン中のユーザーを取得し、型ヒントでUserインスタンスであることを明示
        /** @var User $user */
        $user = Auth::user();

        // ユーザーが認証されていない場合はエラーを返す
        if (!$user) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }

        // トランザクションを開始
        try {
            DB::beginTransaction();
            // 2. 新しいグループを作成
            $group = Group::create([
                'name' => $validatedData['name'],
                'host_user' => $user->id // host_userにログインユーザーのIDを設定
            ]);
            // 3. ユーザーとグループを関連付け
            // `attach`メソッドで中間テーブルにレコードを追加
            $user->groups()->attach($group->id, ['is_member' => true]);
            DB::commit();

            $userGroups = $user->groups()->get();
            return response()->json(['user_groups' => $userGroups], 201);
        } catch (\Exception $e) {
            // エラーが発生した場合、トランザクションは自動的にロールバックされます
            return response()->json(['message' => 'Failed to create group.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function getMemberlist($id)
    {
        $group = Group::with('users')->find($id);
        return response()->json(['users' => $group->users()->wherePivot('is_member', true)->get()], 201);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function addMember(Request $request, $id)
    {
        try {
            $group = Group::find($id);
            // メールでユーザーを検索
            $user = User::where('email', $request->email)->first();
            LOG::info("abc", [$request->email]);
            if (!$user) {
                return response()->json(['message' => '指定したアドレスのユーザーは存在しません'], 400);
            }

            // すでにグループに参加済みかチェック
            if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', true)->exists()) {
                return response()->json(['message' => $user->name . 'さんはすでにグループに参加しています'], 400);
            }

            if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', false)->exists()) {
                return response()->json(['message' => $user->name . 'さんはすでに招待済みです'], 400);
            }

            $user->groups()->attach($group->id, ['is_member' => false]);
            return response()->json(['message' => $user->name . 'さんをグループに招待しました。'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'サーバーエラーが発生しました。'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function joinGroup($id)
    {
        try {
            $group = Group::findOrFail($id);
            $user = Auth::user();

            // 中間テーブルの現在の状態を取得
            $pivotData = $group->users()->where('user_id', $user->id)->first()->pivot;
            if (!($pivotData->is_member)) {
                Log::alert("test1", [$group, $user]);
                $group->users()->updateExistingPivot($user->id, ['is_member' => true]);
            }
            Log::alert("test12", [$group, $user, $pivotData]);
            return response()->json([
                'message' => $group->name . 'に参加しました'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'サーバーエラーが発生しました。',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function getName($id)
    {
        $group = Group::findOrFail($id);
        return response()->json([
            'group_name' => $group->name
        ], 200);
    }

    /**
     * Remove a user from the group.
     */
    public function removeMember(Request $request, $id)
    {
        try {
            $group = Group::findOrFail($id);
            $userId = $request->input('user_id');

            // ユーザー存在確認
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => '指定したユーザーは存在しません'], 404);
            }

            // グループに所属しているか確認
            if (!$group->users()->where('user_id', $userId)->exists()) {
                return response()->json(['message' => $user->name . 'さんはこのグループに所属していません'], 400);
            }

            // グループから削除
            $group->users()->detach($userId);

            return response()->json(['message' => $user->name . 'さんをグループから削除しました'], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'サーバーエラーが発生しました。',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
