"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";

export default function TeamPage() {
  const { salon, isLoading, refetch } = useArtistSalon();
  
  // Add new team member
  const [name, setName] = useState("");
  const [role, setRole] = useState("Junior Stylist");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Edit team member
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const teamMembers = (salon?.team_members || []) as any[];
  const services = (salon?.services || []) as any[];

  async function addMember() {
    if (!salon || !name) return;
    setIsAdding(true);

    const newMember = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      service_ids: selectedServices,
    };

    const updatedTeam = [...teamMembers, newMember];

    const { error } = await supabase
      .from("salons")
      .update({ team_members: updatedTeam })
      .eq("id", salon.id);

    if (!error) {
      setName("");
      setRole("Junior Stylist");
      setPhone("");
      setSelectedServices([]);
      await refetch();
    }
    setIsAdding(false);
  }

  function startEdit(member: any) {
    setEditingId(member.id);
    setEditData({ ...member });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit() {
    if (!salon || !editingId) return;
    setIsSavingEdit(true);

    const updatedTeam = teamMembers.map((m: any) => 
      m.id === editingId ? editData : m
    );

    const { error } = await supabase
      .from("salons")
      .update({ team_members: updatedTeam })
      .eq("id", salon.id);

    if (!error) {
      await refetch();
      setEditingId(null);
    }
    setIsSavingEdit(false);
  }

  async function deleteMember(id: string) {
    if (!salon) return;
    
    const updatedTeam = teamMembers.filter((m: any) => m.id !== id);
    
    const { error } = await supabase
      .from("salons")
      .update({ team_members: updatedTeam })
      .eq("id", salon.id);

    if (!error) {
      await refetch();
    }
  }

  function toggleServiceSelection(serviceId: string, currentSelections: string[], setSelections: (arr: string[]) => void) {
    if (currentSelections.includes(serviceId)) {
      setSelections(currentSelections.filter(id => id !== serviceId));
    } else {
      setSelections([...currentSelections, serviceId]);
    }
  }

  if (isLoading) {
    return <div className="p-8 text-charcoal/50">Loading team...</div>;
  }

  if (!salon) {
    return <div className="p-8 text-charcoal/50">Please set up your salon first.</div>;
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="font-cormorant text-3xl text-primary">Team Management</h1>
        <p className="font-dm-sans text-sm text-charcoal/60 mt-1">
          Add stylists to your salon so brides can select them during booking.
        </p>
      </div>

      {/* Add New Member Form */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6">
        <h2 className="font-dm-sans font-semibold text-primary mb-4">Add Team Member</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-charcoal/50">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-xl border border-gold/30 bg-cream px-4 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-charcoal/50">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Hairstylist"
              className="w-full rounded-xl border border-gold/30 bg-cream px-4 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-charcoal/50">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full rounded-xl border border-gold/30 bg-cream px-4 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-charcoal/50">Can Perform Services</label>
            {services.length === 0 ? (
              <p className="text-xs text-rose">You must add Services in the Services tab before you can assign them to team members.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleServiceSelection(s.id, selectedServices, setSelectedServices)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selectedServices.includes(s.id) 
                        ? "bg-gold text-white border-gold" 
                        : "bg-white text-charcoal border-gold/30 hover:border-gold"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={addMember}
          disabled={isAdding || !name || selectedServices.length === 0}
          className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
        >
          {isAdding ? "Adding..." : "Add Member"}
        </button>
      </div>

      {/* Existing Members List */}
      <div className="space-y-4">
        <h2 className="font-dm-sans font-semibold text-primary">Current Team ({teamMembers.length})</h2>
        
        {teamMembers.length === 0 ? (
          <p className="text-sm text-charcoal/50 italic">No team members added yet. Add yourself or your staff above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {teamMembers.map((member: any) => (
              <div key={member.id} className="rounded-xl border border-gold/20 bg-white p-5">
                {editingId === member.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full rounded border border-gold/30 px-3 py-1 text-sm focus:border-gold"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="w-full rounded border border-gold/30 px-3 py-1 text-sm focus:border-gold"
                      placeholder="Role"
                    />
                    <input
                      type="tel"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full rounded border border-gold/30 px-3 py-1 text-sm focus:border-gold"
                      placeholder="Phone number"
                    />
                    <div className="flex flex-wrap gap-1">
                      {services.map(s => (
                        <button
                          key={s.id}
                          onClick={() => toggleServiceSelection(s.id, editData.service_ids || [], (arr) => setEditData({ ...editData, service_ids: arr }))}
                          className={`px-2 py-1 rounded text-[10px] border ${
                            (editData.service_ids || []).includes(s.id) 
                              ? "bg-gold text-white border-gold" 
                              : "bg-white text-charcoal border-gold/30"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} disabled={isSavingEdit} className="text-xs font-medium text-green-600 hover:underline">Save</button>
                      <button onClick={cancelEdit} className="text-xs text-charcoal/60 hover:underline">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-dm-sans font-bold text-primary">{member.name}</h3>
                        <p className="text-xs text-gold font-medium">{member.role}</p>
                        {member.phone && (
                          <p className="text-xs text-charcoal/50 mt-0.5">📞 {member.phone}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(member)} className="text-xs text-charcoal/50 hover:text-gold">Edit</button>
                        <button onClick={() => deleteMember(member.id)} className="text-xs text-rose/70 hover:text-rose">Remove</button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/40 mb-1">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {(member.service_ids || []).map((sId: string) => {
                          const s = services.find(srv => srv.id === sId);
                          return s ? <span key={sId} className="bg-blush text-primary text-[10px] px-2 py-0.5 rounded">{s.name}</span> : null;
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
