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
        'name', 'email', 'facebook', 'twitter'
    ];

    public function admin()
    {
        return $this->belongsTo('App\User', 'admin_id', 'id');
    }

    public function members()
    {
        return $this->belongsToMany('App\User', 'involve');
    }


}
