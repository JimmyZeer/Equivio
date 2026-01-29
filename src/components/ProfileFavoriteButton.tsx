"use client";

import { FavoriteButton } from "./FavoriteButton";

interface ProfileFavoriteButtonProps {
    practitionerId: string;
}

export function ProfileFavoriteButton({ practitionerId }: ProfileFavoriteButtonProps) {
    return <FavoriteButton practitionerId={practitionerId} size="lg" />;
}
