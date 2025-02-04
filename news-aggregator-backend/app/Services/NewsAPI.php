<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class NewsAPI {

    private $apiKey;
    private $baseUrl = 'https://newsapi.org/v2/';

    public function __construct() {
        $this->apiKey = config('services.newsapi.key');
           }
    
    public function getTopHeadlines($params = []) {
        $response = Http::get($this->baseUrl . 'top-headlines', array_merge([
            'apiKey' => $this->apiKey,
            'country' => 'us',
        ], $params));

        return $response->json();
    }

    public function searchArticles($query, $params = []) {
        $response = Http::get($this->baseUrl . '/everything', array_merge([
            'apiKey' => $this->apiKey,
            'q' => $query,
        ], $params));

        return $response->json();
    }
}       
 