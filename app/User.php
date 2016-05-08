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
        'password',
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

    /**
     * List of hackathons where the user is registered.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function hackathons()
    {
        return $this->belongsToMany('App\Hackathon', 'participate')->withPivot('attending');
    }
}
