<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Hackathon extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'abstract', 'description', 'private_section', 'max_participant', 'max_participant_per_team',
        'place_adr',  'beginning', 'ending',
        'facebook', 'twitter', 'github'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'private_section',
    ];

    /**
     * Disabling Auto Timestamps.
     *
     * @var bool
     */
    public $timestamps = false;

    public function organization()
    {
        return $this->belongsTo('App\Organization');
    }

}
