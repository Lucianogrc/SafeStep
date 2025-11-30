import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Company } from "../models/Company";
import { db } from "./firebaseConfig";

const COLLECTION = "companies";

const CompanyService = {
  async createCompany(
    data: Omit<Company, "createdAt"> & { uid: string; email: string }
  ): Promise<Company> {
    const ref = doc(db, COLLECTION, data.uid);

    const payload: Company = {
      ...data,
      createdAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });

    // 🔹 Opcional: crear / actualizar companiesLocations para el mapa
    const locRef = doc(db, "companiesLocations", data.uid);
    await setDoc(
      locRef,
      {
        companyId: data.uid,
        companyName: data.companyName,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return payload;
  },

  async getCompanyByUid(uid: string): Promise<Company | null> {
    const ref = doc(db, COLLECTION, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as Company;
  },

  async getCurrentCompany(): Promise<Company | null> {
    const auth = getAuth();
    if (!auth.currentUser) return null;
    return this.getCompanyByUid(auth.currentUser.uid);
  },

  async updateCurrentCompany(data: Partial<Company>): Promise<Company | null> {
    const auth = getAuth();
    if (!auth.currentUser) return null;

    const ref = doc(db, COLLECTION, auth.currentUser.uid);
    await updateDoc(ref, { ...data });

    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Company) : null;
  },
};

export default CompanyService;
