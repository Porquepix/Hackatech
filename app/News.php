<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'content'
    ];

    /**
     * Return the hackathon where is posted the news.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function hackathon()
    {
        return $this->belongsTo('App\Hackathon');
    }

}
