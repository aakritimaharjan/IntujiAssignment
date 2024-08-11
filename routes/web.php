<?php

use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('callback', [GoogleController::class, 'handleGoogleCallback']);
Route::get('filters', [GoogleController::class, 'getFilters']);
Route::get('events', [GoogleController::class, 'getEvents']);
Route::post('/events', [GoogleController::class, 'createEvent']);
Route::post('/update-event', [GoogleController::class, 'updateEvent']);
Route::delete('/delete-event', [GoogleController::class, 'deleteEvent']);