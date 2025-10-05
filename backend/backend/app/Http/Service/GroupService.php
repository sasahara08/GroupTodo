<?php

namespace App\Services;

use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GroupService
{
    /**
     * ユーザーが所属するグループを取得
     */
    public function getUserGroups(User $user)
    {
        return $user->groups()->get();
    }

    /**
     * グループ作成
     */
    public function createGroup(User $user, array $data)
    {
        $validated = validator($data, [
            'name' => 'required|string|max:255|min:2',
        ])->validate();

        DB::beginTransaction();
        try {
            $group = Group::create([
                'name' => $validated['name'],
                'host_user' => $user->id
            ]);

            $user->groups()->attach($group->id, ['is_member' => true]);

            DB::commit();
            return $user->groups()->get();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * グループメンバー一覧
     */
    public function getGroupMembers($groupId)
    {
        $group = Group::with('users')->findOrFail($groupId);
        return $group->users()->wherePivot('is_member', true)->get();
    }

    /**
     * メンバーを招待
     */
    public function inviteMember($groupId, $email)
    {
        $group = Group::findOrFail($groupId);
        $user = User::where('email', $email)->first();

        if (!$user) {
            throw new \Exception('指定したアドレスのユーザーは存在しません');
        }

        if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', true)->exists()) {
            throw new \Exception($user->name . 'さんはすでにグループに参加しています');
        }

        if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', false)->exists()) {
            throw new \Exception($user->name . 'さんはすでに招待済みです');
        }

        $user->groups()->attach($group->id, ['is_member' => false]);
        return $user->name . 'さんをグループに招待しました。';
    }

    /**
     * グループ参加処理
     */
    public function joinGroup($groupId, User $user)
    {
        $group = Group::findOrFail($groupId);
        $pivotData = $group->users()->where('user_id', $user->id)->first()->pivot;

        if (!$pivotData->is_member) {
            Log::alert("joinGroup update", [$group->id, $user->id]);
            $group->users()->updateExistingPivot($user->id, ['is_member' => true]);
        }

        return $group->name . 'に参加しました';
    }

    /**
     * グループ名取得
     */
    public function getGroupName($id)
    {
        $group = Group::findOrFail($id);
        return $group->name;
    }
}
