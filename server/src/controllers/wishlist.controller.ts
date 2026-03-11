import { AuthRequest } from "../types/express.types.js";
import { Response } from "express";
import { addToWishlistService, getWishlistService, removeItemWishlistService, emptyWishlistService } from "../services/wishlist.service.js";

export const addToWishlist = async (req: AuthRequest, res: Response) => {
    const userId: number = req.user!.userId;
    const productId: number = Number(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({
        success: false,
        message: "Invalid product id",
        });
    }

    try {
        const addToWishlist = await addToWishlistService(userId, productId);

        res.status(201).json({
            success: true,
            item: addToWishlist
        });
    }catch(err: any){
        res.status(500).json({
            success: false,
            message:  err.message || "Server error" 
        });
    }
}

export const getWishlist = async(req: AuthRequest, res: Response)=>{
    const userId = req.user!.userId;

    try{
        const wishlist = await getWishlistService(userId);

        res.status(200).json({
            success: true,
            wishlist: wishlist
        });
    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const productId = Number(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product id"
        });
    }

    try{
        const deleteWishlist = await removeItemWishlistService(userId, productId);
        res.status(200).json({
            success: true,
            message: "Item removed from wishlist"
        });
    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const emptyWishlist = async(req: AuthRequest, res: Response)=>{
    
    try{
        const userId = req.user!.userId;

        await emptyWishlistService(userId);
        
        res.status(200).json({
            success: true,
            message: "Wishlist is empty."
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to empty wishlist."
        });
    }
} 