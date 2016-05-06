<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function organizationAdmin()
    {
        return $this->hasMany('App\Organization', 'admin_id', 'id');
    }

    public function organizationMember()
    {
        return $this->belongsToMany('App\Organization', 'involve');
    }
}
