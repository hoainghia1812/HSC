import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { Database } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

// Update user role
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and check admin role
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { role } = await request.json()
    
    // Validate role
    const validRoles = ['admin', 'user', 'vip1', 'vip2', 'vip3']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update user role
    const { id } = await context.params
    const updatePayload: Database['public']['Tables']['users']['Update'] = { role }

    const admin = supabaseAdmin as unknown as SupabaseClient<Database>
    type UsersTable = {
      update: (
        payload: Database['public']['Tables']['users']['Update']
      ) => {
        eq: (
          column: 'id',
          value: string
        ) => Promise<{ error: unknown }>
      }
    }
    const usersTable = admin.from('users') as unknown as UsersTable
    const { error } = await usersTable.update(updatePayload).eq('id', id)

    if (error) {
      console.error('Failed to update user role:', error)
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin update user API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token and check admin role
    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prevent admin from deleting themselves
    const { id } = await context.params

    if (user.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    // Delete user
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete user:', error)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin delete user API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
