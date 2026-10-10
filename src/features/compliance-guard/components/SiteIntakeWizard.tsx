'use client';

import React, { useState } from 'react';
import { 
  siteIntakeSchema, 
  SiteIntake, 
  BusinessCategoryEnum, 
  BusinessCategory 
} from '@/lib/compliance/site-intake-schema';
import { evaluateSiteCompliance, CalculatedSafetyRequirements } from '@/lib/compliance/evaluate-site-compliance';

interface WizardProps {
  onComplete?: (intake: SiteIntake, requirements: CalculatedSafetyRequirements) => void;
}

export function SiteIntakeWizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form state
  const [category, setCategory] = useState<BusinessCategory>('fast_food');
  const [otherDescription, setOtherDescription] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [address, setAddress] = useState('');
  const [isShopOrOffice, setIsShopOrOffice] = useState<boolean>(true);

  const [headcount, setHeadcount] = useState<number>(15);
  const [peakOnSite, setPeakOnSite] = useState<number | undefined>(undefined);
  const [contactEmail, setContactEmail] = useState('');

  const [equipment, setEquipment] = useState({
    lpg: false,
    pressureVessels: false,
    deepFryers: false,
    switchboards: true,
    coldRooms: false,
    hazardousChemicals: false,
    forklifts: false,
    highBayStacking: false,
    undergroundFuelTanks: false,
    mhiThresholdExceeded: false,
  });

  const [popiaConsent, setPopiaConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute live preview of derived counts
  const currentIntakeCandidate: Partial<SiteIntake> = {
    category,
    otherDescription: category === 'other' ? otherDescription : undefined,
    employerName: employerName || 'Preview Legal Entity',
    branchName: branchName || 'Preview Site',
    address: address || 'Preview Address',
    headcount: headcount || 1,
    peakOnSite,
    isShopOrOffice,
    equipment,
    contactEmail,
  };

  const parsedCandidate = siteIntakeSchema.safeParse(currentIntakeCandidate);
  const liveRequirements = parsedCandidate.success 
    ? evaluateSiteCompliance(parsedCandidate.data)
    : evaluateSiteCompliance({
        category,
        employerName: 'Preview',
        branchName: 'Preview',
        address: 'Preview',
        headcount: Math.max(1, headcount || 1),
        peakOnSite,
        isShopOrOffice,
        equipment,
      });

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!employerName.trim()) errs.employerName = 'Employer legal entity name is required';
      if (!branchName.trim()) errs.branchName = 'Branch name is required';
      if (!address.trim() || address.length < 5) errs.address = 'Full physical address is required (5+ chars)';
      if (category === 'other' && !otherDescription.trim()) errs.otherDescription = 'Please describe your business category';
    } else if (currentStep === 2) {
      if (!headcount || headcount < 1) errs.headcount = 'Headcount must be at least 1';
      if (peakOnSite !== undefined && peakOnSite > headcount) {
        errs.peakOnSite = 'Peak on-site headcount cannot exceed total headcount';
      }
      if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        errs.contactEmail = 'Please provide a valid email address';
      }
    } else if (currentStep === 4) {
      if (!popiaConsent) {
        errs.popiaConsent = 'You must acknowledge the POPIA data processing privacy consent to proceed';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1) as any);
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(1, prev - 1) as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const fullIntake: SiteIntake = {
      category,
      otherDescription: category === 'other' ? otherDescription : undefined,
      employerName,
      branchName,
      address,
      headcount,
      peakOnSite,
      isShopOrOffice,
      equipment,
      contactEmail: contactEmail || undefined,
    };

    const finalReqs = evaluateSiteCompliance(fullIntake);
    if (onComplete) {
      onComplete(fullIntake, finalReqs);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-card border border-edge rounded-2xl p-8 shadow-sm">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-muted">Statutory OHS Intake Wizard</span>
          <span className="text-xs font-semibold px-2 py-1 bg-surface rounded text-primary">Step {step} of 4</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-surface'}`} 
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Business Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">1. Business Profile & Classification</h2>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-ink mb-1">
                Industry Sector / Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
              >
                <option value="fast_food">Fast Food Franchise (Food & Beverage)</option>
                <option value="coffee_bakery">Coffee Shop & Bakery</option>
                <option value="forecourt">Fuel Service Station Forecourt</option>
                <option value="pharmacy">Retail Community Pharmacy</option>
                <option value="wholesale">Wholesale & Warehousing Depot</option>
                <option value="general_retail">General Commercial Retail</option>
                <option value="other">Other Operations</option>
              </select>
            </div>

            {category === 'other' && (
              <div>
                <label htmlFor="otherDescription" className="block text-sm font-semibold text-ink mb-1">
                  Specify Category Description *
                </label>
                <input
                  id="otherDescription"
                  type="text"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                  placeholder="e.g. Light Manufacturing Workshop"
                />
                {errors.otherDescription && <p className="text-xs text-red-500 mt-1">{errors.otherDescription}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employerName" className="block text-sm font-semibold text-ink mb-1">
                  Employer / Legal Entity Name *
                </label>
                <input
                  id="employerName"
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                  placeholder="e.g. Famous Brands Franchisee Pty Ltd"
                />
                {errors.employerName && <p className="text-xs text-red-500 mt-1">{errors.employerName}</p>}
              </div>

              <div>
                <label htmlFor="branchName" className="block text-sm font-semibold text-ink mb-1">
                  Branch / Operating Name *
                </label>
                <input
                  id="branchName"
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                  placeholder="e.g. Wimpy Southgate Mall"
                />
                {errors.branchName && <p className="text-xs text-red-500 mt-1">{errors.branchName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-ink mb-1">
                Physical Operating Address *
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                placeholder="e.g. Shop U12, Southgate Mall, Columbine Ave, Johannesburg"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Explicit Shop or Office selector (Critical statutory ratio gate) */}
            <div className="bg-surface border border-edge p-4 rounded-xl">
              <label className="block text-sm font-bold text-ink mb-2">
                Workplace Type (OHSA Section 17 Ratio Classification) *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="isShopOrOffice"
                    checked={isShopOrOffice === true}
                    onChange={() => setIsShopOrOffice(true)}
                    className="accent-primary"
                  />
                  <span>
                    <strong>Shop or Office</strong> (1 H&S Representative per 100 employees)
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="isShopOrOffice"
                    checked={isShopOrOffice === false}
                    onChange={() => setIsShopOrOffice(false)}
                    className="accent-primary"
                  />
                  <span>
                    <strong>Other Workplace / Industrial / Depot</strong> (1 H&S Representative per 50 employees)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Headcount & People */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">2. Headcount & Staffing Ratios</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="headcount" className="block text-sm font-semibold text-ink mb-1">
                  Total Employed Headcount *
                </label>
                <input
                  id="headcount"
                  type="number"
                  min="1"
                  value={headcount}
                  onChange={(e) => setHeadcount(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                />
                <p className="text-xs text-muted mt-1">Section 17 reps threshold is &gt;20 employees.</p>
                {errors.headcount && <p className="text-xs text-red-500 mt-1">{errors.headcount}</p>}
              </div>

              <div>
                <label htmlFor="peakOnSite" className="block text-sm font-semibold text-ink mb-1">
                  Peak On-Site Count (Optional Shift Max)
                </label>
                <input
                  id="peakOnSite"
                  type="number"
                  min="1"
                  value={peakOnSite ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    setPeakOnSite(val);
                  }}
                  className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                  placeholder="Defaults to total headcount"
                />
                <p className="text-xs text-muted mt-1">Used for First Aid calculation (threshold &gt;10).</p>
                {errors.peakOnSite && <p className="text-xs text-red-500 mt-1">{errors.peakOnSite}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-ink mb-1">
                Notification & Billing Email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-surface border border-edge rounded-lg p-2.5 text-ink text-sm"
                placeholder="compliance@yourbusiness.co.za"
              />
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
            </div>

            {/* Live derived counts preview card */}
            <div className="bg-surface border border-edge rounded-xl p-5">
              <h3 className="text-xs uppercase font-bold text-muted mb-3">Live Statutory Ratio Preview</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-card p-3 rounded-lg border border-edge">
                  <div className="text-2xl font-black text-ink">{liveRequirements.s17RepsRequired}</div>
                  <div className="text-xs font-semibold text-muted mt-1">H&S Reps (OHSA §17)</div>
                  <div className="text-[10px] text-muted">{headcount > 20 ? (isShopOrOffice ? '1:100' : '1:50') : 'None (≤20)'}</div>
                </div>

                <div className="bg-card p-3 rounded-lg border border-edge">
                  <div className="text-2xl font-black text-ink">{liveRequirements.firstAidersRequired}</div>
                  <div className="text-xs font-semibold text-muted mt-1">First Aiders (GSR 3)</div>
                  <div className="text-[10px] text-muted">{(peakOnSite ?? headcount) > 10 ? '1:50' : 'None (≤10)'}</div>
                </div>

                <div className="bg-card p-3 rounded-lg border border-edge">
                  <div className="text-2xl font-black text-ink">{liveRequirements.fireMarshalsRecommended}</div>
                  <div className="text-xs font-semibold text-muted mt-1">Fire Marshals</div>
                  <div className="text-[10px] text-amber-600 font-medium">Planning Default</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Equipment & Hazard Declarations */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">3. Equipment & Chemical Hazards</h2>
            <p className="text-xs text-muted">Select declared installations to attach the required statutory instruments:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'lpg', label: 'Commercial LPG Gas Installation (Cylinders / Manifold)', cite: 'SANS 10087-1' },
                { key: 'deepFryers', label: 'Commercial Deep Fryers (Thermal Burn Hazard)', cite: 'SANS 10087-1 / Thermal Controls' },
                { key: 'pressureVessels', label: 'Boilers / Genuine Pressure Vessels (>50 kPa)', cite: 'PER 2009' },
                { key: 'switchboards', label: 'Main Electrical Distribution Boards (DB Boards)', cite: 'EIR 2009 / SANS 10142-1' },
                { key: 'undergroundFuelTanks', label: 'Underground Fuel Storage Tanks (UST Forecourt)', cite: 'SANS 10089-3 & 10089-2' },
                { key: 'forklifts', label: 'Forklifts & Lifting Machines / Tackle', cite: 'DMR 18' },
                { key: 'highBayStacking', label: 'High-Bay Pallet Racking / Bulk Stacking', cite: 'GSR 2' },
                { key: 'coldRooms', label: 'Walk-in Cold Rooms & Refrigeration', cite: 'HCS / Temperature Logs' },
                { key: 'hazardousChemicals', label: 'Hazardous Chemical Substances (Cleaning / Solvents)', cite: 'GSR 4 / HCS' },
                { key: 'mhiThresholdExceeded', label: 'Exceeds Major Hazard Installation Thresholds (Bulk Fuel)', cite: 'MHI 2022' },
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start gap-3 p-3 bg-surface border border-edge rounded-lg cursor-pointer hover:bg-surface/80"
                >
                  <input
                    type="checkbox"
                    checked={(equipment as any)[item.key]}
                    onChange={(e) => setEquipment({ ...equipment, [item.key]: e.target.checked })}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <div className="text-sm font-semibold text-ink">{item.label}</div>
                    <div className="text-[11px] text-muted">{item.cite}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review, POPIA Consent & Save */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">4. Review & Compliance Confirmation</h2>

            <div className="bg-surface border border-edge rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-edge pb-2">
                <span className="text-muted">Entity:</span>
                <span className="font-bold text-ink">{employerName} ({branchName})</span>
              </div>
              <div className="flex justify-between border-b border-edge pb-2">
                <span className="text-muted">Classification:</span>
                <span className="text-ink font-semibold">{isShopOrOffice ? 'Shop / Office (1:100)' : 'Other / Industrial (1:50)'}</span>
              </div>
              <div className="flex justify-between border-b border-edge pb-2">
                <span className="text-muted">Headcount:</span>
                <span className="text-ink font-semibold">{headcount} total {peakOnSite ? `(${peakOnSite} peak on site)` : ''}</span>
              </div>
              <div className="flex justify-between border-b border-edge pb-2">
                <span className="text-muted">Statutory Appointments:</span>
                <span className="text-ink font-semibold">
                  {liveRequirements.s17RepsRequired} HSR Reps • {liveRequirements.firstAidersRequired} First Aiders • {liveRequirements.fireMarshalsRecommended} Fire Marshals (Planning)
                </span>
              </div>
              <div className="pt-1">
                <span className="text-xs uppercase font-bold text-muted block mb-1">Attached Statutory Citations ({liveRequirements.citationsUsed.length}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {liveRequirements.citationsUsed.map((id) => (
                    <span key={id} className="px-2 py-0.5 bg-card border border-edge rounded text-xs font-mono text-ink">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* POPIA Privacy notice and mandatory consent checkbox */}
            <div className="bg-surface border border-edge rounded-xl p-4 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popiaConsent}
                  onChange={(e) => setPopiaConsent(e.target.checked)}
                  className="mt-1 accent-primary"
                />
                <span className="text-xs text-ink">
                  I confirm that the operational details and headcount provided are accurate. I consent to the processing of business compliance data in terms of the{' '}
                  <span className="underline font-semibold">Protection of Personal Information Act (POPIA 4 of 2013)</span>.
                </span>
              </label>
              {errors.popiaConsent && <p className="text-xs text-red-500 pl-7">{errors.popiaConsent}</p>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-edge">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 bg-surface border border-edge rounded-lg text-sm font-semibold text-ink hover:bg-surface/80"
            >
              Previous
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow hover:bg-primary/90"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-black shadow hover:bg-emerald-700"
            >
              Save and Pay (R3,500.00)
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
