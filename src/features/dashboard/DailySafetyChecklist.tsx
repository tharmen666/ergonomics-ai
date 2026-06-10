import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { useNellyStore } from '../../store/nellyStore';
import { Language } from '../../utils/translations';

interface ChecklistItem {
    id: 'monitor' | 'chair' | 'feet';
    checked: boolean;
}

const CHECKLIST_TRANSLATIONS: Record<Language, {
    monitor: string;
    chair: string;
    feet: string;
    title: string;
    complete: string;
    compliant: string;
    completed: string;
    feedback: string;
}> = {
    en: {
        monitor: 'Monitor at eye level?',
        chair: 'Chair supporting lower back?',
        feet: 'Feet flat on floor?',
        title: 'Daily Safety Checklist',
        complete: 'Compliance Verified',
        compliant: 'Fully Compliant',
        completed: 'Completed',
        feedback: 'Great job! Your setup is now OHS compliant for the day.'
    },
    zu: {
        monitor: 'I-monitor isezingeni lamehlo?',
        chair: 'Isitulo sisekela ingxenye engezansi yomhlane?',
        feet: 'Izinyawo zicabeke phansi?',
        title: 'Uhlu Lokuhlola Lokuphepha',
        complete: 'Ukuthobela Kuqinisekisiwe',
        compliant: 'Ukuthobela Ngokuphelele',
        completed: 'Kugcwalisiwe',
        feedback: 'Umsebenzi omuhle! Ukusetha kwakho manje sekuyahambisana ne-OHS kulolu suku.'
    },
    xh: {
        monitor: 'Isikrini sikwinqanaba lamehlo?',
        chair: 'Isitulo sixhasa umqolo osezantsi?',
        feet: 'Iinyawo zicaba phantsi?',
        title: 'Uluhlu Lokujonga Ukhuseleko',
        complete: 'Ukuthotyelwa Kuqinisekisiwe',
        compliant: 'Ukuthotyelwa Ngokuphelele',
        completed: 'Kugqityiwe',
        feedback: 'Umsebenzi omhle! Ukuseta kwakho ngoku kuhambelana ne-OHS kule mini.'
    },
    st: {
        monitor: 'Skrine se boemong ba mahlo?',
        chair: 'Setulo se tšehetsa mokokotlo o ka tlaase?',
        feet: 'Maoto a sephara fatše?',
        title: 'Lethathamo la Tlhahlobo ea Polokeho',
        complete: 'Boikarabello bo Netefalitsoe',
        compliant: 'Boikarabello ka Botlalo',
        completed: 'Phethiloe',
        feedback: 'Mosebetsi o motle! Setup sa hau se se se lumellana le OHS bakeng sa letsatsi.'
    },
    af: {
        monitor: 'Monitor op ooghoogte?',
        chair: 'Stoel wat laer rug ondersteun?',
        feet: 'Voete plat op vloer?',
        title: 'Daaglikse Veiligheidskontrolelys',
        complete: 'Voldoening Geverifieer',
        compliant: 'Ten volle Voldoenend',
        completed: 'Voltooi',
        feedback: 'Mooi so! Jou opstelling voldoen nou aan die OHS-wet vir die dag.'
    },
    sw: {
        monitor: 'Je, skrini ipo kwenye kiwango cha macho?',
        chair: 'Je, kiti kinasaidia mgongo wa chini?',
        feet: 'Je, miguu imelala sakafuni?',
        title: 'Orodha ya Ukaguzi ya Kila Siku ya Usalama',
        complete: 'Kufuata Sheria Kumethibitishwa',
        compliant: 'Kufuata Kikamilifu',
        completed: 'Imekamilika',
        feedback: 'Kazi nzuri! Mipangilio yako sasa inafuata sheria za OHS kwa siku ya leo.'
    },
    zh: {
        monitor: '显示器是否与眼睛齐平？',
        chair: '椅子是否支撑下背部？',
        feet: '双脚是否平放于地面？',
        title: '每日安全检查表',
        complete: '安全合规已验证',
        compliant: '完全合规',
        completed: '已完成',
        feedback: '做得好！您的设置今天已完全符合职业安全与健康（OHS）标准。'
    },
    es: {
        monitor: '¿Monitor a la altura de los ojos?',
        chair: '¿Silla que apoya la parte baja de la espalda?',
        feet: '¿Pies planos sobre el suelo?',
        title: 'Lista de Verificación de Seguridad Diaria',
        complete: 'Cumplimiento Verificado',
        compliant: 'Totalmente Cumplidor',
        completed: 'Completado',
        feedback: '¡Buen trabajo! Su configuración ahora cumple con OHS para el día.'
    },
    ko: {
        monitor: '모니터가 눈높이에 있습니까?',
        chair: '의자가 허리를 지탱합니까?',
        feet: '발이 바닥에 평평하게 닿습니까?',
        title: '일일 안전 체크리스트',
        complete: '규정 준수 확인됨',
        compliant: '완전 준수',
        completed: '완료됨',
        feedback: '잘하셨습니다! 귀하의 설정은 오늘 OHS 규정을 준수합니다.'
    }
};

export const DailySafetyChecklist = () => {
    const { language, setSpeaking, setMood } = useNellyStore();
    const [items, setItems] = useState<ChecklistItem[]>([
        { id: 'monitor', checked: false },
        { id: 'chair', checked: false },
        { id: 'feet', checked: false },
    ]);

    const activeLanguage = language as Language || 'en';
    const t = CHECKLIST_TRANSLATIONS[activeLanguage] || CHECKLIST_TRANSLATIONS['en'];

    const allChecked = items.every(item => item.checked);

    const toggleItem = (id: 'monitor' | 'chair' | 'feet') => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    useEffect(() => {
        if (allChecked) {
            setSpeaking(true);
            setMood('happy');
            // Reset speaking after a delay
            const timer = setTimeout(() => {
                setSpeaking(false);
                setMood('neutral');
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [allChecked, setSpeaking, setMood]);

    return (
        <GlassCard className="relative overflow-hidden group">
            {/* Background Glow when complete */}
            <AnimatePresence>
                {allChecked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ohs-green/5 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white tracking-tight uppercase">{t.title}</h3>
                <AnimatePresence>
                    {allChecked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            className="flex items-center gap-2 px-3 py-1 bg-ohs-green/10 border border-ohs-green/20 rounded-full"
                        >
                            <ShieldCheck className="text-ohs-green" size={14} />
                            <span className="text-[10px] font-black text-ohs-green uppercase tracking-widest">{t.complete}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-3">
                {items.map((item) => {
                    const label = t[item.id];
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${item.checked
                                    ? 'bg-ohs-green/10 border-ohs-green/20'
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className={`transition-colors ${item.checked ? 'text-ohs-green' : 'text-gray-500'}`}>
                                {item.checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                            </div>
                            <span className={`text-sm font-bold transition-all text-left ${item.checked ? 'text-white' : 'text-gray-400'
                                }`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Status: {allChecked ? t.compliant : `${items.filter(i => i.checked).length}/3 ${t.completed}`}
                </p>
            </div>

            {/* Nelly's message preview (logical) */}
            {allChecked && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-ohs-orange/10 border border-ohs-orange/20 rounded-lg"
                >
                    <p className="text-[11px] font-bold text-ohs-orange leading-tight">
                        "{t.feedback}"
                    </p>
                </motion.div>
            )}
        </GlassCard>
    );
};
