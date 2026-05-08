export function EmptyState() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Portefeuille</h1>
                <p className="text-muted-foreground">
                    Vue complète de votre portefeuille d&apos;investissement
                </p>
            </div>
            <div className="p-12 text-center text-muted-foreground border rounded-lg">
                <p className="text-lg">Aucune action en portefeuille</p>
                <p className="text-sm mt-2">Ajoutez des actions depuis la page Mes Actions</p>
            </div>
        </div>
    );
}
