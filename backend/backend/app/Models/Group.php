<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    // 複数代入可能なカラムを指定（セキュリティ対策）
    protected $fillable = [
        'name',
        'user_id',
        'host_user', // もし追加したカラムがある場合
    ];

    // もし自動で設定したいデフォルト値があれば
    protected $attributes = [
        'name' => '未設定グループ',  // デフォルト名
    ];

    // 日付のキャスト（created_at, updated_at は自動で管理される）
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The users that belong to the group.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('is_member');
    }

    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }

    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user');
    }
}
