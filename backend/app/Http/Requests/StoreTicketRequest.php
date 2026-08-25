<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreTicketRequest extends FormRequest { public function authorize():bool{return true;} public function rules():array{return ['title'=>'required|string|max:180','description'=>'required|string','type'=>'required|in:INCIDENT,SERVICE_REQUEST','priority'=>'required|in:HIGH,MEDIUM,LOW','category_id'=>'required|integer','subcategory_id'=>'nullable|integer','department_id'=>'required|integer'];} }
