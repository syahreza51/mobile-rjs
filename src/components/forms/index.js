// --- GROUP PAPA ---
import { FormManlift } from './papa/FormManlift';
import { FormGondola } from './papa/FormGondola';
import { FormForklift } from './papa/FormForklift';
import { FormMobileCrane } from './papa/FormMobileCrane';
import { FormTowerCrane } from './papa/FormTowerCrane';
import { FormOverheadCrane } from './papa/FormOverheadCrane';
import { FormExcavator } from './papa/FormExcavator';
import { FormPassengerHoist } from './papa/FormPassengerHoist';

// --- GROUP PUBT ---
import { FormBoiler } from './pubt/FormBoiler';
import { FormBejanaTekan } from './pubt/FormBejanaTekan';
import { FormTangkiTimbun } from './pubt/FormTangkiTimbun';
import { FormPesawatPendingin } from './pubt/FormPesawatPendingin';

// --- GROUP LISTRIK ---
import { FormInstalasiListrik } from './listrik/FormInstalasiListrik';
import { FormPanelListrik } from './listrik/FormPanelListrik';
import { FormPetirGrounding } from './listrik/FormPetirGrounding';
import { FormPenangkalPetir } from './listrik/FormPenangkalPetir';

// --- GROUP FIRE ---
import { FormApar } from './fire/FormApar';
import { FormHydrant } from './fire/FormHydrant';
import { FormSprinkler } from './fire/FormSprinkler';
import { FormFireAlarm } from './fire/FormFireAlarm';
import { FormEvakuasiSuppression } from './fire/FormEvakuasiSuppression';

// --- GROUP PTP ---
import { FormMesinPerkakas } from './ptp/FormMesinPerkakas';
import { FormMesinPress } from './ptp/FormMesinPress';
import { FormMotorDiesel } from './ptp/FormMotorDiesel';
import { FormTurbin } from './ptp/FormTurbin';
import { FormGenset } from './ptp/FormGenset';
import { FormTanur } from './ptp/FormTanur';

// Import LIFT Group
import { FormLiftPenumpang } from './lift/FormLiftPenumpang';
import { FormLiftBarang } from './lift/FormLiftBarang';
import { FormEskalator } from './lift/FormEskalator';
import { FormTravelator } from './lift/FormTravelator';
import { FormDumbwaiter } from './lift/FormDumbwaiter';

// --- SHARED ---
import { FormDataUmum } from './shared/FormDataUmum';
import { FormCatatan } from './shared/FormCatatan';
import { PhotoManager } from './shared/PhotoManager';

// Export Shared secara individu
export { FormDataUmum, FormCatatan, PhotoManager };

export const FormRegistry = {
  // PAPA (Pesawat Angkat & Angkut)
  Forklift: FormForklift,
  'Mobile Crane': FormMobileCrane,
  'Tower Crane': FormTowerCrane,
  'Overhead Crane': FormOverheadCrane,
  Excavator: FormExcavator,
  'Passenger Hoist': FormPassengerHoist,
  'Manlift / Scissor Lift': FormManlift,
  Gondola: FormGondola,

  // PUBT (Pesawat Uap & Bejana Tekan)
  'Boiler (Ketel Uap)': FormBoiler,
  'Bejana Tekan': FormBejanaTekan,
  'Tangki Timbun (BBM/Kimia)': FormTangkiTimbun,
  'Pesawat Pendingin': FormPesawatPendingin,

  // LISTRIK (K3 Listrik & Petir)
  'Instalasi Listrik Ruangan': FormInstalasiListrik,
  'Panel-Panel Listrik': FormPanelListrik,
  'Sistem Grounding': FormPetirGrounding,
  'Penangkal Petir': FormPenangkalPetir,

  // FIRE (Proteksi Kebakaran)
  'APAR (Alat Pemadam Api Ringan)': FormApar,
  'Sistem Hydrant': FormHydrant,
  'Sistem Sprinkler': FormSprinkler,
  'Fire Alarm System': FormFireAlarm,
  'Evakuasi & Suppression': FormEvakuasiSuppression,

  // PTP (Pesawat Tenaga & Produksi)
  'Mesin Perkakas (Bubut/Frais)': FormMesinPerkakas,
  'Mesin Press': FormMesinPress,
  'Motor Diesel': FormMotorDiesel,
  Turbin: FormTurbin,
  Genset: FormGenset,
  'Tanur/Furnace': FormTanur,

  // LIFT (Pesawat Lift dan Eskalator)
  'Lift Penumpang': FormLiftPenumpang,
  'Lift Barang': FormLiftBarang,
  'Tangga Berjalan (Eskalator)': FormEskalator,
  'Ban Berjalan (Travelator)': FormTravelator,
  'Lift Pelayan (Dumbwaiter)': FormDumbwaiter,
};
