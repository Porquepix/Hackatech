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

    /**
     * List of project where the user is admin.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function projectAdmin()
    {
        return $this->hasMany('App\Project', 'admin_id', 'id');
    }

    /**
     * List of projects where the user is member.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function projectMember()
    {
        return $this->belongsToMany('App\Project', 'join')->withPivot('validate');
    }

    /**
     * Get the project of a user for an hackathon.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function getProject($hackathon_id)
    {
        $project = $this->projectMember()->where('hackathon_id', $hackathon_id)->first();
        if ($project == null) {
            $project = $this->projectAdmin()->where('hackathon_id', $hackathon_id)->first();
        }
        return $project;
    }

}
