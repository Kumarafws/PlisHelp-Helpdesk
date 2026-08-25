<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Subcategory extends Model { protected $fillable=['category_id','name','is_active']; protected $casts=['is_active'=>'boolean']; public function category(){return $this->belongsTo(Category::class);} public function tickets(){return $this->hasMany(Ticket::class);} }
