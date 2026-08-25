<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
class DashboardController extends Controller { public function summary(Request $request){$q=Ticket::forRole($request->user()); return ['total'=>$q->count(),'open'=>(clone $q)->where('status','open')->count(),'in_progress'=>(clone $q)->where('status','in_progress')->count(),'resolved_this_month'=>(clone $q)->where('status','resolved')->whereMonth('resolved_at',now()->month)->count(),'breached'=>(clone $q)->breached()->count()];} }
