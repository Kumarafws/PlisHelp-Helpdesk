<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request) { return Ticket::with(['requester','assignee'])->forRole($request->user())->status($request->query('status'))->priority($request->query('priority'))->latest()->paginate(20); }
    public function show(Request $request, Ticket $ticket) { abort_unless($request->user()->isSupport() || $ticket->requester_id === $request->user()->id, 403); return $ticket->load(['requester','assignee','comments','activities']); }
    public function store(Request $request) { $data = $request->validate(['title'=>'required|string|max:150','description'=>'required|string','category_id'=>'required|exists:categories,id','department_id'=>'required|exists:departments,id','priority'=>'in:low,medium,high']); $data += ['requester_id'=>$request->user()->id,'status'=>'open','number'=>'TKT-'.random_int(1000,9999)]; return response()->json(Ticket::create($data), 201); }
    public function update(Request $request, Ticket $ticket) { abort_unless($request->user()->isSupport(), 403); $ticket->update($request->validate(['status'=>'in:open,in_progress,resolved,closed','priority'=>'in:low,medium,high','resolution'=>'nullable|string'])); return $ticket->fresh(); }
    public function assign(Request $request, Ticket $ticket) { abort_unless($request->user()->isSupport(), 403); $ticket->update($request->validate(['assignee_id'=>'required|exists:users,id'])); return $ticket->fresh(); }
    public function transition(Request $request, Ticket $ticket) { abort_unless($request->user()->isSupport() || $ticket->requester_id === $request->user()->id, 403); $ticket->update($request->validate(['status'=>'required|in:open,in_progress,resolved,closed'])); return $ticket->fresh(); }
    public function comment(Request $request, Ticket $ticket) { abort_unless($request->user()->isSupport() || $ticket->requester_id === $request->user()->id, 403); return $ticket->comments()->create(['user_id'=>$request->user()->id,'body'=>$request->validate(['body'=>'required|string|max:5000'])['body']]); }
    public function destroy(Request $request, Ticket $ticket) { abort_unless($request->user()->isAdmin(), 403); $ticket->delete(); return response()->noContent(); }
}
