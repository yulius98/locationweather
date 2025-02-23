<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    private $apiKey = 'dc66c034f624b80aad12630db9315438';
    private $baseUrl = 'https://api.openweathermap.org/data/2.5';

    public function index()
    {
        return view('weather');
    }

    public function getWeatherData(Request $request)
    {
        $location = $request->input('location', 'London');
        
        try {
            $currentWeather = Http::get("{$this->baseUrl}/weather", [
                'q' => $location,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ])->json();

            $forecast = Http::get("{$this->baseUrl}/forecast", [
                'q' => $location,
                'appid' => $this->apiKey,
                'units' => 'metric'
            ])->json();

            return response()->json([
                'current' => $currentWeather,
                'forecast' => $forecast
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch weather data'], 500);
        }
    }
}