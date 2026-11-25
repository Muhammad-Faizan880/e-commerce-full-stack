import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface MongoUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminCustomersTableProps {
  users: MongoUser[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AdminCustomersTable: React.FC<AdminCustomersTableProps> = ({
  users,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-offwhite-surface border border-copen-border overflow-hidden rounded-xs">
      <div className="p-4 border-b border-copen-border flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-black">
            Registered Copenhagen Accounts ({users.length})
          </h3>
          <p className="text-[11px] text-copen-gray mt-0.5">
            Verified private client registrations synchronized from MongoDB database
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          leftIcon={<RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Sync Data
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-offwhite-card border-b border-copen-border text-[10px] uppercase tracking-widest text-copen-gray">
            <tr>
              <th className="py-3 px-4">Client Name</th>
              <th className="py-3 px-4">Registered Email</th>
              <th className="py-3 px-4">Account Role</th>
              <th className="py-3 px-4">Cluster Source</th>
              <th className="py-3 px-4 text-right">Joined / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-copen-border">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-offwhite-hover/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-copen-black">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-copen-muted text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-olive-900 text-offwhite-50'
                          : 'bg-offwhite-card text-copen-gray border border-copen-border'
                      }`}
                    >
                      {u.role || 'customer'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-olive-800 text-[11px] font-mono">
                    MongoDB Atlas
                  </td>
                  <td className="py-3.5 px-4 text-right text-copen-gray text-[11px]">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-copen-gray text-xs">
                  No registered accounts currently found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
