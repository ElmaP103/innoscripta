<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Artisan;

class ServeWithScheduler extends Command
{
  protected $signature = 'serve:withscheduler';
  protected $description = 'Serve the application with scheduler running';

  public function handle()
  {
    $this->info('Starting server and scheduler...');

    // Run news:scrape immediately
    $this->info('Running initial news scrape...');
    Artisan::call('news:scrape');
    $this->info('Initial news scrape completed');

    // Start the scheduler in background
    $scheduler = new Process(['php', 'artisan', 'schedule:work']);
    $scheduler->setTimeout(null);
    $scheduler->start();

    // Start the server
    $server = new Process(['php', 'artisan', 'serve']);
    $server->setTimeout(null);
    $server->run(function ($type, $buffer) {
      $this->output->write($buffer);
    });

    // Kill the scheduler when the server stops
    $scheduler->stop();
  }
}