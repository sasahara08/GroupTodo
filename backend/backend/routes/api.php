<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::middleware('web')->group(function () {

    // 登録ルート
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('guest')
        ->name('register');

    // ログインルート (webミドルウェアでセッションを有効化)
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('guest');

    // パスワードリセット関連
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('guest')
        ->name('password.email');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('guest')
        ->name('password.store');

    // ログアウト (セッション破棄にwebミドルウェアが必要)
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout')
        ->middleware('auth:sanctum'); // 認証済みユーザーのみ
});


Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');


/*
|--------------------------------------------------------------------------
| 認証済みユーザー向けAPIルート
|--------------------------------------------------------------------------
| ほとんどのAPIエンドポイントはauth:sanctumでステートレスに処理されます。
*/

// ログイン済みユーザー情報の取得
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // Auth::user() ではなく $request->user() を使う方が一般的です
});


// Group関連のルート
Route::middleware('auth:sanctum')->prefix('group')->group(function () {
    Route::get('/getlist', [GroupController::class, 'index']);
    Route::get('/getName/{id}', [GroupController::class, 'getName']);
    Route::get('/memberList/{id}', [GroupController::class, 'getMemberlist']);
    Route::post('/regist', [GroupController::class, 'store']);
    Route::post('/addMember/{id}', [GroupController::class, 'addMember']);
    Route::put('/joinGroup/{id}', [GroupController::class, 'joinGroup']);
    Route::delete('/removeMember/{id}', [GroupController::class, 'removeMember']);
});

// Todo関連のルート
Route::middleware('auth:sanctum')->prefix('todo')->group(function () {
    Route::get('/{id}', [TodoController::class, 'show']);
    Route::post('/register', [TodoController::class, 'store']);
    Route::put('/update/{id}', [TodoController::class, 'update']);
    Route::put('/changeCompleted/{id}', [TodoController::class, 'changeCompleted']);
    Route::delete('/destroy/{id}', [TodoController::class, 'destroy']);
    Route::post('/updateLock/{id}', [TodoController::class, 'updateLock']);
});
