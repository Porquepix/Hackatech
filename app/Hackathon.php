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

    private $current_participant = null;

    /**
     * Return the organization which organizes the hackathon.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function organization()
    {
        return $this->belongsTo('App\Organization');
    }

    /**
     * Return the list of participants of the hackathon.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function participants()
    {
        return $this->belongsToMany('App\User', 'participate')->withPivot('attending');
    }

    /**
     * Test if the user is registered in the hackathon.
     *
     * @param User|null $user
     * @return bool
     */
    public function isRegistered(User $user = null)
    {
        if (isset($user))
        {
            $this->current_participant = $this->participants()->where('user_id', $user->id)->first();
            return  $this->current_participant != null;
        }
        return false;
    }


    /**
     * Test is the user attends to the hackathon.
     * Always call isRegistered() method before call this one.
     *
     * @return bool
     */
    public function isAttending()
    {
        return $this->current_participant != null && $this->current_participant->pivot->attending;
    }

    /**
     * Test if the user is an organizator of the hackthon.
     * The admin of the organization is not concidered as an organizator.
     *
     * @param User|null $user
     * @return bool
     */
    public function isOrganizator(User $user = null)
    {
        if (isset($user))
        {
            return $user->organizationMember()->where('organization_id', $this->organization_id)->first() != null;
        }
        return false;
    }

    /**
     * Test if the user is the admin of the hackathon.
     *
     * @param User|null $user
     * @return bool
     */
    public function isAdmin(User $user = null)
    {
        if (isset($user))
        {
            return $this->organization->isAdmin($user);
        }
        return false;
    }


}
