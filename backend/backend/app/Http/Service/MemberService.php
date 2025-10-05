<?php

namespace App\Services;

use App\Models\Group;
use App\Models\User;

class MemberService
{
    public function addMember(Group $group, string $email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return ['status' => false, 'message' => '指定したアドレスのユーザーは存在しません'];
        }

        if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', true)->exists()) {
            return ['status' => false, 'message' => $user->name . 'さんはすでにグループに参加しています'];
        }

        if ($group->users()->where('user_id', $user->id)->wherePivot('is_member', false)->exists()) {
            return ['status' => false, 'message' => $user->name . 'さんはすでに招待済みです'];
        }

        $user->groups()->attach($group->id, ['is_member' => false]);
        return ['status' => true, 'message' => $user->name . 'さんをグループに招待しました。'];
    }

    public function joinGroup(Group $group, User $user)
    {
        $pivotData = $group->users()->where('user_id', $user->id)->first()->pivot;

        if (!$pivotData->is_member) {
            $group->users()->updateExistingPivot($user->id, ['is_member' => true]);
        }

        return ['status' => true, 'message' => $group->name . 'に参加しました'];
    }
}
