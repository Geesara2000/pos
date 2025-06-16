<?php

use App\Http\Controllers\Admin\CashierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/admin/login',   [AuthController::class, 'adminLogin']);
Route::post('/cashier/login', [AuthController::class, 'cashierLogin']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin-only product management routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/products/store', [ProductController::class, 'store']);
        Route::post('/products/update/{id}', [ProductController::class, 'update']);
        Route::delete('/products/delete/{id}', [ProductController::class, 'delete']);

        Route::get('/get/cashiers', [CashierController::class, 'index']);
        Route::delete('/delete/cashier/{id}', [CashierController::class, 'remove']);
    });

    // Admin and Cashier can view products
    Route::middleware('role:admin,cashier')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
    });
});


