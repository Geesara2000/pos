<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CashierController extends Controller
{
    // Get all products
    public function index()
    {
        $cashiers = User::where('role', 'cashier')->get();
        return response()->json($cashiers, 200);
    }

    // // Update a product
    // public function update(Request $request, $id)
    // {
    //     $product = Product::find($id);

    //     if (!$product) {
    //         return response()->json(['message' => 'Product not found'], 404);
    //     }

    //     $validated = $request->validate([
    //         'name' => 'sometimes|required|string|max:255',
    //         'description' => 'nullable|string',
    //         'price' => 'sometimes|required|numeric',
    //         'quantity' => 'sometimes|required|integer',
    //         'barcode' => 'sometimes|required|string|unique:products,barcode,' . $id,
    //         'category' => 'sometimes|required|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    //     ]);

    //     if ($request->hasFile('image')) {
    //         // Delete the old image if exists
    //         if ($product->image && Storage::disk('public')->exists($product->image)) {
    //             Storage::disk('public')->delete($product->image);
    //         }

    //         // Store the new image
    //         $imagePath = $request->file('image')->store('products', 'public');
    //         $validated['image'] = '/storage/' . $imagePath;
    //     }

    //     $product->update($validated);

    //     return response()->json([
    //         'message' => 'product updated successfully',
    //         'product' => $product
    //     ], 201);
    // }

    // Remove a cashier
    public function remove($id)
    {
        $cashier = User::find($id);

        if (!$cashier) {
            return response()->json(['message' => 'cashier not found'], 404);
        }

        $cashier->delete();

        return response()->json(['message' => 'cashier removed'], 200);
    }
}
