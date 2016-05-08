<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParticipateTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('participate', function (Blueprint $table) {
            $table->integer('hackathon_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->boolean('attending')->default(false);

            $table->primary(['hackathon_id', 'user_id']);
            $table->foreign('hackathon_id')->references('id')->on('hackathons')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('participate');
    }
}
