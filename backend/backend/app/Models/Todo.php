<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    /**
     * 一括代入可能な属性
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'group_id',
        'title',
        'description',
        'due_date',
        'image_url',
        'completed',
        'is_important',
        'lock_time',
        'lock_user_id'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'lock_time' => 'datetime',
    ];

    /**
     * モデルのタイムスタンプを更新するか
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * このTodoが属するグループを取得するリレーションシップ
     *
     * @return BelongsTo
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
