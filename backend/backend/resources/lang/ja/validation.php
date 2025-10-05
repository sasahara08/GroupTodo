<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => ':attributeを承認してください。',
    'accepted_if' => ':otherが:valueの場合、:attributeを承認してください。',
    'active_url' => ':attributeは、有効なURLではありません。',
    'after' => ':attributeは、:dateより後の日付にしてください。',
    'after_or_equal' => ':attributeは、:date以降の日付にしてください。',
    'alpha' => ':attributeは、アルファベットのみにしてください。',
    'alpha_dash' => ':attributeは、英数字、ハイフン、アンダースコアのみにしてください。',
    'alpha_num' => ':attributeは、英数字のみにしてください。',
    'any_of' => ':attributeフィールドが無効です。',
    'array' => ':attributeは、配列にしてください。',
    'ascii' => ':attributeは、1バイトの英数字と記号のみにしてください。',
    'before' => ':attributeは、:dateより前の日付にしてください。',
    'before_or_equal' => ':attributeは、:date以前の日付にしてください。',
    'between' => [
        'array' => ':attributeは、:min個から:max個の間にしてください。',
        'file' => ':attributeは、:min KBから:max KBの間にしてください。',
        'numeric' => ':attributeは、:minから:maxの間にしてください。',
        'string' => ':attributeは、:min文字から:max文字の間にしてください。',
    ],
    'boolean' => ':attributeは、trueかfalseにしてください。',
    'can' => ':attributeフィールドに不正な値が含まれています。',
    'confirmed' => ':attributeの確認が一致しません。',
    'contains' => ':attributeフィールドに必要な値がありません。',
    'current_password' => 'パスワードが正しくありません。',
    'date' => ':attributeは、有効な日付にしてください。',
    'date_equals' => ':attributeは、:dateと同じ日付にしてください。',
    'date_format' => ':attributeは、:format形式と一致しません。',
    'decimal' => ':attributeは、:decimal桁の小数である必要があります。',
    'declined' => ':attributeは、拒否してください。',
    'declined_if' => ':otherが:valueの場合、:attributeは拒否してください。',
    'different' => ':attributeと:otherは、異なるものにしてください。',
    'digits' => ':attributeは、:digits桁にしてください。',
    'digits_between' => ':attributeは、:min桁から:max桁の間にしてください。',
    'dimensions' => ':attributeの画像サイズが無効です。',
    'distinct' => ':attributeフィールドに重複した値があります。',
    'doesnt_contain' => ':attributeは、以下のいずれかを含んではいけません: :values。',
    'doesnt_end_with' => ':attributeは、以下のいずれかで終わってはいけません: :values。',
    'doesnt_start_with' => ':attributeは、以下のいずれかで始まってはいけません: :values。',
    'email' => ':attributeは、有効なメールアドレスにしてください。',
    'ends_with' => ':attributeは、次のいずれかで終わる必要があります: :values。',
    'enum' => '選択された:attributeは無効です。',
    'exists' => '選択された:attributeは無効です。',
    'extensions' => ':attributeは、次の拡張子のいずれかである必要があります: :values。',
    'file' => ':attributeは、ファイルにしてください。',
    'filled' => ':attributeは、値が必要です。',
    'gt' => [
        'array' => ':attributeは、:value個より多くの項目が必要です。',
        'file' => ':attributeは、:valueキロバイトより大きい必要があります。',
        'numeric' => ':attributeは、:valueより大きい必要があります。',
        'string' => ':attributeは、:value文字より多い必要があります。',
    ],
    'gte' => [
        'array' => ':attributeは、:value個以上の項目が必要です。',
        'file' => ':attributeは、:valueキロバイト以上である必要があります。',
        'numeric' => ':attributeは、:value以上である必要があります。',
        'string' => ':attributeは、:value文字以上である必要があります。',
    ],
    'hex_color' => ':attributeは、有効な16進数カラーにしてください。',
    'image' => ':attributeは、画像にしてください。',
    'in' => '選択された:attributeは無効です。',
    'in_array' => ':attributeフィールドは、:otherに存在しません。',
    'in_array_keys' => ':attributeフィールドには、次のいずれかのキーが含まれている必要があります: :values。',
    'integer' => ':attributeは、整数にしてください。',
    'ip' => ':attributeは、有効なIPアドレスにしてください。',
    'ipv4' => ':attributeは、有効なIPv4アドレスにしてください。',
    'ipv6' => ':attributeは、有効なIPv6アドレスにしてください。',
    'json' => ':attributeは、有効なJSON文字列にしてください。',
    'list' => ':attributeは、リストにしてください。',
    'lowercase' => ':attributeは、小文字にしてください。',
    'lt' => [
        'array' => ':attributeは、:value個より少ない項目が必要です。',
        'file' => ':attributeは、:valueキロバイトより小さい必要があります。',
        'numeric' => ':attributeは、:valueより小さい必要があります。',
        'string' => ':attributeは、:value文字より少ない必要があります。',
    ],
    'lte' => [
        'array' => ':attributeは、:value個以下の項目が必要です。',
        'file' => ':attributeは、:valueキロバイト以下である必要があります。',
        'numeric' => ':attributeは、:value以下である必要があります。',
        'string' => ':attributeは、:value文字以下である必要があります。',
    ],
    'mac_address' => ':attributeは、有効なMACアドレスにしてください。',
    'max' => [
        'array' => ':attributeは、:max個以下の項目にしてください。',
        'file' => ':attributeは、:maxキロバイト以下にしてください。',
        'numeric' => ':attributeは、:max以下にしてください。',
        'string' => ':attributeは、:max文字以下にしてください。',
    ],
    'max_digits' => ':attributeは、:max桁以下にしてください。',
    'mimes' => ':attributeは、:valuesタイプのファイルにしてください。',
    'mimetypes' => ':attributeは、:valuesタイプのファイルにしてください。',
    'min' => [
        'array' => ':attributeは、:min個以上の項目にしてください。',
        'file' => ':attributeは、:minキロバイト以上にしてください。',
        'numeric' => ':attributeは、:min以上にしてください。',
        'string' => ':attributeは、:min文字以上にしてください。',
    ],
    'min_digits' => ':attributeは、:min桁以上にしてください。',
    'missing' => ':attributeフィールドは必須ではありません。',
    'missing_if' => ':otherが:valueの場合、:attributeフィールドは必須ではありません。',
    'missing_unless' => ':otherが:valueでない限り、:attributeフィールドは必須ではありません。',
    'missing_with' => ':valuesが存在する場合、:attributeフィールドは必須ではありません。',
    'missing_with_all' => ':valuesがすべて存在する場合、:attributeフィールドは必須ではありません。',
    'multiple_of' => ':attributeは、:valueの倍数にしてください。',
    'not_in' => '選択された:attributeは無効です。',
    'not_regex' => ':attributeの形式が無効です。',
    'numeric' => ':attributeは、数字にしてください。',
    'password' => [
        'letters' => ':attributeは、少なくとも1つのアルファベットを含んでください。',
        'mixed' => ':attributeは、少なくとも1つの大文字と1つの小文字を含んでください。',
        'numbers' => ':attributeは、少なくとも1つの数字を含んでください。',
        'symbols' => ':attributeは、少なくとも1つの記号を含んでください。',
        'uncompromised' => '入力された:attributeはデータ漏洩で検出されました。別の:attributeを選択してください。',
    ],
    'present' => ':attributeは、存在している必要があります。',
    'present_if' => ':otherが:valueの場合、:attributeは存在している必要があります。',
    'present_unless' => ':otherが:valueでない限り、:attributeは存在している必要があります。',
    'present_with' => ':valuesが存在する場合、:attributeは存在している必要があります。',
    'present_with_all' => ':valuesがすべて存在する場合、:attributeは存在している必要があります。',
    'prohibited' => ':attributeフィールドは禁止されています。',
    'prohibited_if' => ':otherが:valueの場合、:attributeフィールドは禁止されています。',
    'prohibited_if_accepted' => ':otherが受け入れられた場合、:attributeフィールドは禁止されています。',
    'prohibited_if_declined' => ':otherが拒否された場合、:attributeフィールドは禁止されています。',
    'prohibited_unless' => ':otherが:valuesに含まれていない限り、:attributeフィールドは禁止されています。',
    'prohibits' => ':attributeは、:otherを禁止します。',
    'regex' => ':attributeの形式が無効です。',
    'required' => ':attributeは、必須項目です。',
    'required_array_keys' => ':attributeは、次のキーを含んでいる必要があります: :values。',
    'required_if' => ':otherが:valueの場合、:attributeは必須項目です。',
    'required_if_accepted' => ':otherが受け入れられた場合、:attributeは必須項目です。',
    'required_if_declined' => ':otherが拒否された場合、:attributeは必須項目です。',
    'required_unless' => ':otherが:valuesに含まれていない限り、:attributeは必須項目です。',
    'required_with' => ':valuesが存在する場合、:attributeは必須項目です。',
    'required_with_all' => ':valuesがすべて存在する場合、:attributeは必須項目です。',
    'required_without' => ':valuesが存在しない場合、:attributeは必須項目です。',
    'required_without_all' => ':valuesのいずれも存在しない場合、:attributeは必須項目です。',
    'same' => ':attributeと:otherは、一致する必要があります。',
    'size' => [
        'array' => ':attributeは、:size個の項目にしてください。',
        'file' => ':attributeは、:sizeキロバイトにしてください。',
        'numeric' => ':attributeは、:sizeにしてください。',
        'string' => ':attributeは、:size文字にしてください。',
    ],
    'starts_with' => ':attributeは、次のいずれかで始まる必要があります: :values。',
    'string' => ':attributeは、文字列にしてください。',
    'timezone' => ':attributeは、有効なタイムゾーンにしてください。',
    'unique' => '既に使用されいる:attributeです。',
    'uploaded' => ':attributeのアップロードに失敗しました。',
    'uppercase' => ':attributeは、大文字にしてください。',
    'url' => ':attributeは、有効なURLにしてください。',
    'ulid' => ':attributeは、有効なULIDにしてください。',
    'uuid' => ':attributeは、有効なUUIDにしてください。',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'お名前',
        'email' => 'メールアドレス',
        'password' => 'パスワード',
        'password_confirmation' => 'パスワード確認',
    ],

];
