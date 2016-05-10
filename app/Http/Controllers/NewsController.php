<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Requests\News\CreateNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\News;
use App\Hackathon;

class NewsController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['index', 'show', 'latest']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($hackathon_id)
    {
        return Hackathon::findOrFail($hackathon_id)->news()->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateNewsRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateNewsRequest $request, $hackathon_id)
    {
        $news = new News();
        $news->fill($request->all());
        $news->hackathon_id = $hackathon_id;
        $news->save();
        return response()->json(['message' => 'The news has been successfully created !']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $news_id
     * @return \Illuminate\Http\Response
     */
    public function show($hackathon_id, $news_id)
    {
        return News::findOrFail($news_id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $hackathon_id
     * @return \Illuminate\Http\Response
     */
    public function latest($hackathon_id)
    {
        return Hackathon::findOrFail($hackathon_id)->news()->take(3)->get();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateNewsRequest  $request
     * @param  int  $hackathon_id
     * @param  int  $news_id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateNewsRequest $request, $hackathon_id, $news_id)
    {
        $news = News::findOrFail($news_id);
        $news->fill($request->all());
        $news->save();
        return response()->json(['message' => 'The news has been successfully updated !']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param UpdateNewsRequest $request
     * @param  int  $hackathon_id
     * @param  int  $news_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(UpdateNewsRequest $request, $hackathon_id, $news_id)
    {
        News::destroy($news_id);
        return response()->json(['message' => 'The news has been successfully deleted !']);
    }

}
