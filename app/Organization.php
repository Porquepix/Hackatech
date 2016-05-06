<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{


    public function admin()
    {
        return $this->belongsTo('App\User', 'admin_id', 'id');
    }

    public function members()
    {
        return $this->belongsToMany('App\User', 'involve');
    }


}
