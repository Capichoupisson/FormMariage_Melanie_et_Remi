import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

const RoomBookingSystem = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [roomToCancel, setRoomToCancel] = useState(null);
  
  // Données réelles des chambres
  const roomsData = [
    { roomNumber: 11, bedType: "Double", capacity: 2 },
    { roomNumber: 12, bedType: "Double", capacity: 2 },
    { roomNumber: 14, bedType: "Double", capacity: 2 },
    { roomNumber: 15, bedType: "Double", capacity: 2 },
    { roomNumber: 16, bedType: "Double", capacity: 2 },
    { roomNumber: 21, bedType: "Double", capacity: 2 },
    { roomNumber: 22, bedType: "Double", capacity: 2 },
    { roomNumber: 36, bedType: "Double", capacity: 2 },
    { roomNumber: 38, bedType: "Avec 3 lits séparés", capacity: 3 },
    { roomNumber: 39, bedType: "Twin", capacity: 2 },
    { roomNumber: 40, bedType: "Twin", capacity: 2 },
    { roomNumber: 41, bedType: "Double", capacity: 2 },
    { roomNumber: 42, bedType: "Double", capacity: 2 },
    { roomNumber: 44, bedType: "Avec 3 lits séparés", capacity: 3 },
    { roomNumber: 45, bedType: "Double", capacity: 2 },
    { roomNumber: 46, bedType: "Double", capacity: 2 },
    { roomNumber: 48, bedType: "Avec 3 lits séparés", capacity: 3 },
    { roomNumber: 50, bedType: "Avec 5 lits séparés", capacity: 5 }
  ];
  
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem('hotelRooms');
    if (savedRooms) {
      const parsedRooms = JSON.parse(savedRooms);
      if (parsedRooms.length !== roomsData.length) {
        return roomsData.map(room => ({
          ...room,
          isBooked: false,
          bookedBy: null,
          email: null,
          guests: null,
          bookingDate: null
        }));
      }
      
      return parsedRooms.map(savedRoom => {
        const newRoomData = roomsData.find(r => r.roomNumber === savedRoom.roomNumber);
        if (newRoomData) {
          return {
            ...savedRoom,
            bedType: newRoomData.bedType,
            capacity: newRoomData.capacity
          };
        }
        return savedRoom;
      });
    } else {
      return roomsData.map(room => ({
        ...room,
        isBooked: false,
        bookedBy: null,
        email: null,
        guests: null,
        bookingDate: null
      }));
    }
  });
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: ''
  });

  useEffect(() => {
    localStorage.setItem('hotelRooms', JSON.stringify(rooms));
  }, [rooms]);

  const handleBooking = (roomNumber) => {
    setRooms(rooms.map(room => 
      room.roomNumber === roomNumber ? {
        ...room,
        isBooked: true,
        bookedBy: formData.name,
        email: formData.email,
        guests: formData.guests,
        bookingDate: new Date().toLocaleString()
      } : room
    ));
    setSelectedRoom(null);
    setFormData({ name: '', email: '', guests: '' });
    setEditMode(false);
  };

  const handleModifyBooking = (roomNumber) => {
    const room = rooms.find(r => r.roomNumber === roomNumber);
    if (room && room.isBooked) {
      setFormData({
        name: room.bookedBy,
        email: room.email,
        guests: room.guests
      });
      setSelectedRoom(roomNumber);
      setEditMode(true);
    }
  };

  const handleCancelBooking = (roomNumber) => {
    setRooms(rooms.map(room => 
      room.roomNumber === roomNumber ? {
        ...room,
        isBooked: false,
        bookedBy: null,
        email: null,
        guests: null,
        bookingDate: null
      } : room
    ));
    setRoomToCancel(null);
    setShowCancelConfirm(false);
    setConfirmEmail('');
  };

  const initiateCancel = (roomNumber) => {
    setRoomToCancel(roomNumber);
    setShowCancelConfirm(true);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'mariage2025') {
      setIsAdmin(true);
      setShowAdminLogin(false);
    }
  };

  const exportToCSV = () => {
    const bookedRooms = rooms.filter(room => room.isBooked);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Chambre,Type de lit,Capacité,Nom,Email,Nombre d'invités,Date de réservation\n"
      + bookedRooms.map(room => 
          `${room.roomNumber},${room.bedType},${room.capacity},${room.bookedBy},${room.email},${room.guests},${room.bookingDate}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reservations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetBookings = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réservations ? Cette action est irréversible.")) {
      const resetRooms = roomsData.map(room => ({
        ...room,
        isBooked: false,
        bookedBy: null,
        email: null,
        guests: null,
        bookingDate: null
      }));
      
      setRooms(resetRooms);
      localStorage.setItem('hotelRooms', JSON.stringify(resetRooms));
    }
  };

  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const bookedCapacity = rooms
    .filter(room => room.isBooked)
    .reduce((sum, room) => sum + parseInt(room.guests || 0), 0);
  
  const bookedRooms = rooms.filter(room => room.isBooked).length;
  const totalRooms = rooms.length;

  // Couleurs automnales
  const colors = {
    primary: '#8B4513', // Marron châtaigne
    secondary: '#D2691E', // Marron clair
    accent: '#A0522D', // Marron rouge
    background: '#FFF8DC', // Beige doux
    text: '#5E2612', // Marron foncé
    cardBg: '#FFF8E5', // Beige clair
    available: '#DAA520', // Doré
    booked: '#8B4513', // Marron châtaigne
    highlight: '#FF8C00', // Orange foncé
    border: '#CD853F', // Beige doré
    header: '#6B4226', // Marron foncé
  };

  return (
    <div className="p-4 max-w-6xl mx-auto" style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-0" style={{ color: colors.primary }}>
          Réservation de chambres Château des Broyers<br/>
          <span className="text-xl sm:text-2xl">Mariage Mélanie & Rémi</span>
        </h1>
        <Button 
          onClick={() => setShowAdminLogin(true)}
          className="text-sm"
          style={{ backgroundColor: colors.primary, color: 'white' }}
        >
          Administration
        </Button>
      </div>

      <div className="mb-8 p-4 rounded-lg text-center" style={{ backgroundColor: colors.cardBg, borderLeft: `4px solid ${colors.accent}` }}>
        <p className="text-lg" style={{ color: colors.text }}>
          Cliquez sur l'une des chambres disponibles et remplissez les informations associées. 
          <br/>Pour rappel le tarif est de 45€ par personne, petit-déjeuner du dimanche matin inclus. 
          <br/>Le règlement se fera directement auprès des mariés.
        </p>
        <p className="mt-2" style={{ color: colors.text }}>
          Pour modifier ou annuler une réservation, cliquez sur la chambre concernée.
        </p>
      </div>

      {showAdminLogin && !isAdmin && (
        <div className="mb-6 p-4 border rounded-lg" style={{ borderColor: colors.border }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.header }}>Connexion Administration</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Mot de passe"
              className="max-w-xs"
              style={{ borderColor: colors.border }}
            />
            <Button 
              onClick={handleAdminLogin}
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Se connecter
            </Button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold" style={{ color: colors.header }}>Tableau des réservations</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="text-sm p-2 rounded" style={{ backgroundColor: `${colors.cardBg}CC` }}>
                <div><span className="font-semibold" style={{ color: colors.text }}>Chambres réservées:</span> {bookedRooms}/{totalRooms}</div>
                <div><span className="font-semibold" style={{ color: colors.text }}>Personnes hébergées:</span> {bookedCapacity}/{totalCapacity}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={exportToCSV} 
                  size="sm"
                  style={{ backgroundColor: colors.secondary, color: 'white' }}
                >
                  Exporter en CSV
                </Button>
                <Button 
                  onClick={resetBookings} 
                  variant="destructive" 
                  size="sm"
                  style={{ backgroundColor: '#D32F2F' }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${colors.border}` }}>
            <table className="w-full border-collapse" style={{ backgroundColor: colors.cardBg }}>
              <thead>
                <tr style={{ backgroundColor: colors.accent, color: 'white' }}>
                  <th className="px-4 py-2 text-left">Chambre</th>
                  <th className="px-4 py-2 text-left">Type de lit</th>
                  <th className="px-4 py-2 text-left">Capacité</th>
                  <th className="px-4 py-2 text-left">Nom</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Invités</th>
                  <th className="px-4 py-2 text-left">Date de réservation</th>
                </tr>
              </thead>
              <tbody>
                {rooms
                  .filter(room => room.isBooked)
                  .sort((a, b) => a.roomNumber - b.roomNumber)
                  .map((room) => (
                    <tr key={room.roomNumber} className="border-b hover:opacity-90" 
                        style={{ borderColor: colors.border }}>
                      <td className="px-4 py-2">{room.roomNumber}</td>
                      <td className="px-4 py-2">{room.bedType}</td>
                      <td className="px-4 py-2">{room.capacity}</td>
                      <td className="px-4 py-2">{room.bookedBy}</td>
                      <td className="px-4 py-2">{room.email}</td>
                      <td className="px-4 py-2">{room.guests}</td>
                      <td className="px-4 py-2">{room.bookingDate}</td>
                    </tr>
                  ))}
                {rooms.filter(room => room.isBooked).length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center" style={{ color: colors.text }}>
                      Aucune réservation pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms
          .sort((a, b) => a.roomNumber - b.roomNumber)
          .map((room) => (
            <Dialog key={room.roomNumber}>
              <DialogTrigger asChild>
                <Card 
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow rounded-lg"
                  style={{ 
                    backgroundColor: room.isBooked ? `${colors.cardBg}` : colors.cardBg,
                    borderLeft: `4px solid ${room.isBooked ? colors.booked : colors.available}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold" style={{ color: colors.text }}>Ch. {room.roomNumber}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#FF8C00', color: 'white' }}>
                      {room.capacity} pers.
                    </span>
                  </div>
                  
                  <div className="mt-3 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded"
                          style={{ backgroundColor: '#8B4513', color: 'white' }}>
                      {room.bedType}
                    </span>
                  </div>
                  
                  {room.isBooked ? (
                    <div className="mt-3 py-1 px-2 text-sm font-medium rounded"
                         style={{ backgroundColor: '#FFE5E5', color: '#D32F2F', border: '1px solid #FFCDD2' }}>
                      <p className="font-medium">Réservée</p>
                      <p className="truncate text-xs mt-1">{room.bookedBy}</p>
                    </div>
                  ) : (
                    <div className="mt-3 py-1 px-2 text-sm font-medium rounded"
                         style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9' }}>
                      Disponible
                    </div>
                  )}
                </Card>
              </DialogTrigger>
              
              {!room.isBooked ? (
                <DialogContent className="rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: colors.primary }}>Réserver la Chambre {room.roomNumber}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 mb-4 space-y-2" style={{ color: colors.text }}>
                    <p><span className="font-medium">Type de lit:</span> {room.bedType}</p>
                    <p><span className="font-medium">Capacité:</span> {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}</p>
                    <p><span className="font-medium">Tarif:</span> {room.capacity * 45}€ pour la chambre complète</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" style={{ color: colors.text }}>Nom</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Votre nom"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" style={{ color: colors.text }}>Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="votre@email.com"
                        style={{ borderColor: colors.border }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests" style={{ color: colors.text }}>Nombre d'invités</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={room.capacity}
                        value={formData.guests}
                        onChange={(e) => setFormData({...formData, guests: e.target.value})}
                        placeholder={`1-${room.capacity} personnes`}
                        style={{ borderColor: colors.border }}
                      />
                      {parseInt(formData.guests) > room.capacity && (
                        <p className="text-red-500 text-sm mt-1">
                          Cette chambre ne peut accueillir que {room.capacity} personnes maximum.
                        </p>
                      )}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleBooking(room.roomNumber)}
                      disabled={
                        !formData.name || 
                        !formData.email || 
                        !formData.guests || 
                        parseInt(formData.guests) > room.capacity
                      }
                      style={{ 
                        backgroundColor: colors.primary, 
                        color: 'white',
                        opacity: (!formData.name || !formData.email || !formData.guests || parseInt(formData.guests) > room.capacity) ? 0.5 : 1
                      }}
                    >
                      Réserver
                    </Button>
                  </div>
                </DialogContent>
              ) : (
                <DialogContent className="rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: colors.primary }}>Chambre {room.roomNumber} - Réservée</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2 mb-4 space-y-2" style={{ color: colors.text }}>
                    <p><span className="font-medium">Type de lit:</span> {room.bedType}</p>
                    <p><span className="font-medium">Capacité:</span> {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}</p>
                    <p><span className="font-medium">Réservée par:</span> {room.bookedBy}</p>
                    <p><span className="font-medium">Email:</span> {room.email}</p>
                    <p><span className="font-medium">Nombre d'invités:</span> {room.guests}</p>
                    <p><span className="font-medium">Date de réservation:</span> {room.bookingDate}</p>
                  </div>
                  
                  {editMode && selectedRoom === room.roomNumber ? (
                    <div className="space-y-4">
                      <p className="font-medium" style={{ color: colors.accent }}>Modifier votre réservation:</p>
                      <div>
                        <Label htmlFor="edit-name" style={{ color: colors.text }}>Nom</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          style={{ borderColor: colors.border }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email" style={{ color: colors.text }}>Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{ borderColor: colors.border }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-guests" style={{ color: colors.text }}>Nombre d'invités</Label>
                        <Input
                          id="edit-guests"
                          type="number"
                          min="1"
                          max={room.capacity}
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: e.target.value})}
                          style={{ borderColor: colors.border }}
                        />
                        {parseInt(formData.guests) > room.capacity && (
                          <p className="text-red-500 text-sm mt-1">
                            Cette chambre ne peut accueillir que {room.capacity} personnes maximum.
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              name: room.bookedBy,
                              email: room.email,
                              guests: room.guests
                            });
                          }}
                          style={{ 
                            backgroundColor: '#9E9E9E', 
                            color: 'white',
                          }}
                        >
                          Annuler
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => handleBooking(room.roomNumber)}
                          disabled={
                            !formData.name || 
                            !formData.email || 
                            !formData.guests || 
                            parseInt(formData.guests) > room.capacity
                          }
                          style={{ 
                            backgroundColor: colors.primary, 
                            color: 'white',
                            opacity: (!formData.name || !formData.email || !formData.guests || parseInt(formData.guests) > room.capacity) ? 0.5 : 1
                          }}
                        >
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        className="flex-1"
                        onClick={() => handleModifyBooking(room.roomNumber)}
                        style={{ backgroundColor: colors.secondary, color: 'white' }}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => initiateCancel(room.roomNumber)}
                        style={{ backgroundColor: '#D32F2F', color: 'white' }}
                      >
                        Annuler la réservation
                      </Button>
                    </div>
                  )}
                </DialogContent>
              )}
            </Dialog>
          ))}
      </div>
      
      {/* Confirmation d'annulation */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="rounded-lg" style={{ backgroundColor: colors.cardBg }}>
          <DialogHeader>
            <DialogTitle style={{ color: colors.primary }}>Confirmer l'annulation</DialogTitle>
            <DialogDescription style={{ color: colors.text }}>
              Veuillez confirmer que vous souhaitez annuler votre réservation.
            </DialogDescription>
          </DialogHeader>
          
          {roomToCancel && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                <p style={{ color: colors.text }}><span className="font-medium">Chambre:</span> {roomToCancel}</p>
                <p style={{ color: colors.text }}><span className="font-medium">Réservée par:</span> {rooms.find(r => r.roomNumber === roomToCancel)?.bookedBy}</p>
              </div>
              
              <div>
                <Label htmlFor="confirm-email" style={{ color: colors.text }}>
                  Pour confirmer, veuillez saisir l'email utilisé lors de la réservation
                </Label>
                <Input
                  id="confirm-email"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{ borderColor: colors.border }}
                  className="mt-1"
                />
                
                {confirmEmail && confirmEmail !== rooms.find(r => r.roomNumber === roomToCancel)?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    L'email ne correspond pas à celui utilisé pour la réservation.
                  </p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2 pt-4">
            <Button 
              onClick={() => {
                setShowCancelConfirm(false);
                setRoomToCancel(null);
                setConfirmEmail('');
              }}
              style={{ backgroundColor: '#9E9E9E', color: 'white' }}
            >
              Retour
            </Button>
            <Button 
              className="flex-1"
              onClick={() => handleCancelBooking(roomToCancel)}
              disabled={!confirmEmail || confirmEmail !== rooms.find(r => r.roomNumber === roomToCancel)?.email}
              style={{ 
                backgroundColor: '#D32F2F', 
                color: 'white',
                opacity: (!confirmEmail || confirmEmail !== rooms.find(r => r.roomNumber === roomToCancel)?.email) ? 0.5 : 1
              }}
            >
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-6 text-center text-sm" style={{ color: colors.text }}>
        <p>Cliquez sur une chambre disponible pour la réserver</p>
        <p>Pour modifier ou annuler votre réservation, cliquez sur votre chambre réservée</p>
      </div>
      
      <div className="mt-8 text-center text-xs p-4" style={{ color: `${colors.text}80` }}>
        <p>Château des Broyers - Mariage Mélanie & Rémi</p>
      </div>
    </div>
  );
};

export default RoomBookingSystem;