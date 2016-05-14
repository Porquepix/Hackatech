<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'private_section', 'facebook', 'twitter', 'github'
    ];

    /**
     * Disabling Auto Timestamps.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'private_section',
    ];

    /**
     * Test if the user is the admin of the project.
     *
     * @param User|null $user
     * @return bool
     */
    public function isAdmin(User $user = null)
    {
        if (isset($user))
        {
            return $this->admin_id == $user->id;
        }
        return false;
    }

}
