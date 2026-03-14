import { GlassCard } from '../../components/ui/GlassCard';
import { GlowButton } from '../../components/ui/GlowButton';
import { ShoppingBag } from 'lucide-react';
import { useAgentLog } from '../../store/agentLogStore';

const products = [
    { id: 1, name: "ErgoSafe Lumbar Pillow", price: "$29.99", image: "🛋️" },
    { id: 2, name: "Melly Approved Blue Light Glasses", price: "$19.99", image: "👓" },
    { id: 3, name: "Adjustable Desk Riser", price: "$149.99", image: "🖥️" },
    { id: 4, name: "Hydrate Smart Bottle", price: "$39.99", image: "💧" },
    { id: 5, name: "Safety First Mug", price: "$12.99", image: "☕" },
    { id: 6, name: "Anti-Fatigue Mat", price: "$49.99", image: "🦶" },
];

export const ShopPage = () => {
    const { addLog } = useAgentLog();

    const handleAddToCart = (name: string) => {
        addLog('Finance', `Detected purchase intent: ${name}. Verifying stock...`);
        setTimeout(() => addLog('Finance', `Stock confirmed. Added ${name} to cart cache.`), 800);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Safety Store</h2>
                    <p className="text-gray-400">Upgrade your workspace with premium gear.</p>
                </div>
                <GlowButton variant="secondary">
                    <ShoppingBag size={18} className="inline mr-2" /> Cart (0)
                </GlowButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                    <GlassCard key={p.id} className="relative group overflow-hidden">
                        <div className="h-40 bg-white/5 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                            {p.image}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                        <p className="text-ohs-orange font-bold text-xl mb-4">{p.price}</p>
                        <GlowButton className="w-full" onClick={() => handleAddToCart(p.name)}>Add to Cart</GlowButton>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
