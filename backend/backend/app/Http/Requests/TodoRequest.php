<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TodoRequest extends FormRequest
{
    /**
     * このリクエストが承認されているかを決定します。
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * リクエストに適用されるバリデーションルールを取得します。
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            // 'title' => 'required|string|max:255',
            'title' => 'string|max:255',
            'details' => 'nullable|string',
            'due_date' => 'nullable|date',
            'group_id' => 'exists:groups,id',
            'file' => 'nullable|image|mimes:jpeg,png,jpg|max:5000',
        ];
    }

    /**
     * バリデーションエラーメッセージの属性名をカスタマイズします。
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'タスクタイトル',
            'details' => 'タスク詳細',
            'due_date' => '期限',
            'group_id' => 'グループ',
            'file' => '添付ファイル',
        ];
    }
}
