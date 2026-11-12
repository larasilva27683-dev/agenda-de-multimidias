import React, { useState, useEffect, useCallback } from 'react';
import { Equipment, Reservation, UserProfile } from './types';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { EquipmentCatalogView } from './components/EquipmentCatalogView';
import { BookingFormView } from './components/BookingFormView';
import { CalendarView } from './components/CalendarView';
import { MyReservationsView } from './components/MyReservationsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ReceiptModal } from './components/ReceiptModal';
import { NewEquipmentModal } from './components/NewEquipmentModal';
import { EditTeacherModal } from './components/EditTeacherModal';
import { EditReservationModal } from './components/EditReservationModal';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(storageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(storageService.getUsers());
  
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Modals
  const [receiptReservation, setReceiptReservation] = useState<Reservation | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedEquipmentId, setPreselectedEquipmentId] = useState<string | undefined>(undefined);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);
  
  // Quick Edit Modals
  const [isEditTeacherOpen, setIsEditTeacherOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = useCallback(() => {
    const eqList = storageService.getEquipments();
    const resList = storageService.getReservations();
    const uList = storageService.getUsers();
    setEquipments(eqList);
    setReservations(resList);
    setAllUsers(uList);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSwitchUser = (user: UserProfile) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Perfil alterado para ${user.name} (${user.subject || user.department})`);
  };

  const handleSaveTeacher = (updatedUser: UserProfile) => {
    storageService.updateUserProfile(updatedUser);
    setCurrentUser(updatedUser);
    loadData();
    setIsEditTeacherOpen(false);
    showToast(`Professor atualizado para: ${updatedUser.name} (${updatedUser.subject || updatedUser.department})`);
  };

  const handleSaveReservation = (updatedRes: Reservation) => {
    storageService.updateReservation(updatedRes);
    loadData();
    setReservationToEdit(null);
    showToast(`Reserva ${updatedRes.id} atualizada com sucesso!`);
  };

  const handleOpenBookingModal = (equipmentId?: string) => {
    setPreselectedEquipmentId(equipmentId);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newRes: Reservation) => {
    setIsBookingModalOpen(false);
    loadData();
    setReceiptReservation(newRes);
    showToast(`Agendamento ${newRes.id} confirmado com sucesso!`);
  };

  const handleOpenReceipt = (res: Reservation) => {
    setReceiptReservation(res);
  };

  const pendingApprovalsCount = reservations.filter(r => r.status === 'pendente').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        onOpenBookingModal={handleOpenBookingModal}
        onEditTeacher={() => setIsEditTeacherOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'home' && (
          <HomeView
            equipments={equipments}
            reservations={reservations}
            currentUser={currentUser}
            onOpenBookingModal={handleOpenBookingModal}
            onNavigateToTab={setCurrentTab}
            onOpenReceipt={handleOpenReceipt}
            onEditTeacher={() => setIsEditTeacherOpen(true)}
            onEditReservation={(res) => setReservationToEdit(res)}
          />
        )}

        {currentTab === 'equipments' && (
          <EquipmentCatalogView
            equipments={equipments}
            onSelectEquipmentToBook={handleOpenBookingModal}
            onOpenNewEquipmentModal={() => {
              setEquipmentToEdit(null);
              setIsEquipmentModalOpen(true);
            }}
            isAdmin={currentUser.role === 'admin'}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            reservations={reservations}
            equipments={equipments}
            onOpenReceipt={handleOpenReceipt}
            onOpenBooking={() => handleOpenBookingModal()}
            onEditReservation={(res) => setReservationToEdit(res)}
          />
        )}

        {currentTab === 'my-reservations' && (
          <MyReservationsView
            reservations={reservations}
            equipments={equipments}
            currentUser={currentUser}
            onOpenReceipt={handleOpenReceipt}
            onOpenBooking={() => handleOpenBookingModal()}
            onEditReservation={(res) => setReservationToEdit(res)}
            onRefresh={loadData}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            equipments={equipments}
            reservations={reservations}
            currentUser={currentUser}
            onOpenNewEquipmentModal={() => {
              setEquipmentToEdit(null);
              setIsEquipmentModalOpen(true);
            }}
            onEditEquipment={(eq) => {
              setEquipmentToEdit(eq);
              setIsEquipmentModalOpen(true);
            }}
            onRefresh={loadData}
            onOpenReceipt={handleOpenReceipt}
            onEditReservation={(res) => setReservationToEdit(res)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer onNavigateToTab={setCurrentTab} />

      {/* Booking Form Modal */}
      {isBookingModalOpen && (
        <BookingFormView
          equipments={equipments}
          currentUser={currentUser}
          initialEquipmentId={preselectedEquipmentId}
          onSuccess={handleBookingSuccess}
          onCancel={() => setIsBookingModalOpen(false)}
          isModal={true}
        />
      )}

      {/* Printable Receipt Modal */}
      {receiptReservation && (
        <ReceiptModal
          reservation={receiptReservation}
          equipment={equipments.find(e => e.id === receiptReservation.equipmentId)}
          onClose={() => setReceiptReservation(null)}
          onEdit={(res) => setReservationToEdit(res)}
        />
      )}

      {/* Edit Teacher Name & Subject Modal */}
      {isEditTeacherOpen && (
        <EditTeacherModal
          user={currentUser}
          onSave={handleSaveTeacher}
          onClose={() => setIsEditTeacherOpen(false)}
        />
      )}

      {/* Edit Any Reservation Details Modal */}
      {reservationToEdit && (
        <EditReservationModal
          reservation={reservationToEdit}
          equipments={equipments}
          onSave={handleSaveReservation}
          onClose={() => setReservationToEdit(null)}
        />
      )}

      {/* Add / Edit Equipment Modal */}
      {isEquipmentModalOpen && (
        <NewEquipmentModal
          equipmentToEdit={equipmentToEdit}
          onClose={() => {
            setIsEquipmentModalOpen(false);
            setEquipmentToEdit(null);
          }}
          onSuccess={() => {
            loadData();
            showToast(equipmentToEdit ? 'Equipamento atualizado com sucesso!' : 'Novo equipamento cadastrado no patrimônio!');
          }}
        />
      )}

    </div>
  );
}
