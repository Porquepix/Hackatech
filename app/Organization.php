<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'facebook', 'twitter', 'github'
    ];

    /**
     * Disabling Auto Timestamps.
     *
     * @var bool
     */
    public $timestamps = false;


    /**
     * Return the admin (user) of the organization.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admin()
    {
        return $this->belongsTo('App\User', 'admin_id', 'id');
    }

    /**
     * Return the list of members (users) of the organization.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function members()
    {
        return $this->belongsToMany('App\User', 'involve');
    }


}
