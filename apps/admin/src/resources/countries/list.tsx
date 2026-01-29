// ============================================
// LISTE DES PAYS - VERSION AMÉLIORÉE
// ============================================
// Table avec filtres, actions, styles light theme
// Location: apps/admin/src/resources/countries/list.tsx

import { 
  List, 
  useTable, 
  EditButton, 
  DeleteButton,
  CreateButton,
} from '@refinedev/antd';
import { Table, Space, Badge, Typography, Button, Popconfirm, message, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDelete } from '@refinedev/core';

const { Text } = Typography;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Couleurs par niveau de risque
const riskConfig: Record<string, { color: string; label: string; emoji: string }> = {
  high: { color: 'gold', label: 'Élevé', emoji: '🟡' },
  critical: { color: 'orange', label: 'Critique', emoji: '🟠' },
  extreme: { color: 'red', label: 'Extrême', emoji: '🔴' },
};

// ============================================
// COMPOSANT
// ============================================

export const CountryList = () => {
  const { tableProps, filters } = useTable({
    syncWithLocation: true,
  });

  const { mutate: deleteCountry } = useDelete();

  // Gestion suppression avec confirmation
  const handleDelete = (id: string, name: string) => {
    deleteCountry(
      { resource: 'countries', id },
      {
        onSuccess: () => {
          message.success(`✅ ${name} a été supprimé`);
        },
        onError: (error: any) => {
          message.error(`❌ Erreur : ${error?.message || 'Impossible de supprimer'}`);
        },
      }
    );
  };

  return (
    <List
      headerProps={{
        extra: (
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {tableProps.dataSource?.length || 0} pays
            </Text>
            <CreateButton type="primary" />
          </Space>
        ),
      }}
    >
      <Table 
        {...tableProps} 
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total : ${total} pays`,
        }}
      >
        
        {/* Nom du pays */}
        <Table.Column
          dataIndex="name"
          title="Pays"
          width={140}
          render={(value) => (
            <Text strong style={{ color: '#2a2a2a' }}>
              {value}
            </Text>
          )}
          sorter={(a: any, b: any) => (a.name || '').localeCompare(b.name || '')}
        />
        
        {/* Code ISO */}
        <Table.Column
          dataIndex="code"
          title="Code ISO"
          width={90}
          render={(value) => (
            <Tag 
              style={{ 
                backgroundColor: '#f5f5f0',
                color: '#2a2a2a',
                border: '1px solid #e8dcc8',
                fontSize: 11,
              }}
            >
              {value}
            </Tag>
          )}
          sorter={(a: any, b: any) => (a.code || '').localeCompare(b.code || '')}
        />
        
        {/* Coordonnées */}
        <Table.Column
          dataIndex="coords"
          title="Position"
          width={120}
          render={(value) => (
            value ? (
              <Text type="secondary" style={{ fontSize: 11 }}>
                {value.lat.toFixed(2)}, {value.lng.toFixed(2)}
              </Text>
            ) : (
              <Text type="danger">-</Text>
            )
          )}
        />
        
        {/* Niveau de risque */}
        <Table.Column
          dataIndex="riskLevel"
          title="Niveau de risque"
          width={140}
          render={(value) => {
            const config = riskConfig[value] || { color: 'default', label: 'Inconnu', emoji: '❓' };
            return (
              <Badge
                color={config.color}
                text={<span style={{ fontSize: 12 }}>{config.emoji} {config.label}</span>}
              />
            );
          }}
          filters={[
            { text: '🟡 Élevé', value: 'high' },
            { text: '🟠 Critique', value: 'critical' },
            { text: '🔴 Extrême', value: 'extreme' },
          ]}
          onFilter={(value, record: any) => record.riskLevel === value}
        />
        
        {/* Description (tronquée) */}
        <Table.Column
          dataIndex="description"
          title="Description"
          ellipsis
          render={(value) => (
            <Text 
              type="secondary" 
              style={{ fontSize: 12 }}
              ellipsis={{ tooltip: value }}
            >
              {value?.substring(0, 50)}...
            </Text>
          )}
        />
        
        {/* Actions */}
        <Table.Column
          title="Actions"
          width={100}
          fixed="right"
          render={(_, record: any) => (
            <Space size="small">
              <EditButton 
                hideText 
                size="small" 
                recordItemId={record.id}
                title="Modifier"
              />
              
              <Popconfirm
                title="Supprimer ?"
                description={`Êtes-vous sûr de vouloir supprimer ${record.name} ? Les journalistes associés ne seront pas supprimés.`}
                okText="Oui, supprimer"
                cancelText="Annuler"
                okType="danger"
                onConfirm={() => handleDelete(record.id, record.name)}
              >
                <Button 
                  danger 
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  title="Supprimer"
                />
              </Popconfirm>
            </Space>
          )}
        />
        
      </Table>
    </List>
  );
};

export default CountryList;