<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/login',   [AuthController::class, 'adminLogin']);
Route::post('/cashier/login', [AuthController::class, 'cashierLogin']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
