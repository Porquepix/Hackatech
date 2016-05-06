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
        'name', 'email', 'password', 'facebook', 'twitter', 'github'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * List of organizations where the user is admin.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function organizationAdmin()
    {
        return $this->hasMany('App\Organization', 'admin_id', 'id');
    }

    /**
     * List of organizations where the user is member.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function organizationMember()
    {
        return $this->belongsToMany('App\Organization', 'involve');
    }
}
