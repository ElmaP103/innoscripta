<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Article;

class ScrapeNewsArticles extends Command
{
    protected $signature = 'news:scrape';
    protected $description = 'Scrape news articles from various sources';

    private $newsApiKey;
    private $baseUrl = 'https://newsapi.org/v2';

    public function __construct()
    {
        parent::__construct();
        $this->newsApiKey = env('NEWS_API_KEY');
    }

    public function handle()
    {
        if (!$this->newsApiKey) {
            $this->error('NEWS_API_KEY not found in .env');
            return 1;
        }

        $this->scrapeNewsAPI();
        $this->scrapeGuardian();
        $this->scrapeNYTimes();
        
        $count = Article::count();
        $this->info("Total articles: $count");
    }

    private function scrapeNewsAPI()
    {
        try {
            $this->info('Starting NewsAPI scrape...');
            
            $response = Http::withHeaders([
                'X-Api-Key' => $this->newsApiKey
            ])->timeout(60)->get($this->baseUrl . '/top-headlines', [
                'country' => 'us',
                'pageSize' => 20,
                'language' => 'en'
            ]);

            if ($response->successful()) {
                $articles = $response->json()['articles'] ?? [];
                $this->info('Found ' . count($articles) . ' articles');

                foreach ($articles as $article) {
                    try {
                        Article::updateOrCreate(
                            ['url' => $article['url']],
                            [
                                'title' => $article['title'] ?? '',
                                'description' => $article['description'] ?? '',
                                'source' => $article['source']['name'] ?? 'Unknown',
                                'published_at' => $article['publishedAt'] ?? now(),
                                'category' => 'general'
                            ]
                        );
                    } catch (\Exception $e) {
                        $this->error('Error saving article: ' . $e->getMessage());
                        continue;
                    }
                }
                $this->info('NewsAPI articles scraped successfully');
            } else {
                $this->error('NewsAPI Error Response: ' . $response->body());
            }
        } catch (\Exception $e) {
            $this->error('NewsAPI Error: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
        }
    }

    private function scrapeGuardian()
    {
        $this->info('Guardian API scraping not implemented yet');
    }

    private function scrapeNYTimes()
    {
        $this->info('NYTimes API scraping not implemented yet');
    }
}