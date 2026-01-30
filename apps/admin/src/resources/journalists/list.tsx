// ============================================
// LISTE DES JOURNALISTES - VERSION AMÉLIORÉE
// ============================================
// Table avec actions, statuts, styles light theme
// Location: apps/admin/src/resources/journalists/list.tsx

import { 
  List, 
  useTable, 
  EditButton, 
  DeleteButton,
  CreateButton,
} from '@refinedev/antd';
import { Table, Space, Image, Badge, Typography, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDelete } from '@refinedev/core';

import { db } from "../../lib/firebase"; // ou ton chemin
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from 'react';



const { Text } = Typography;

// ============================================
// COMPOSANT
// ============================================

export const JournalistList = () => {
  // Hook Refine pour la gestion du tableau
  const { tableProps, setFilters, filters } = useTable({
    syncWithLocation: true,
  });

  const { mutate: deleteJournalist } = useDelete();

  // Gestion suppression avec confirmation
  const handleDelete = (id: string, name: string) => {
    deleteJournalist(
      { resource: 'journalists', id },
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

  useEffect(() => {
  const testFirebase = async () => {
    const querySnapshot = await getDocs(collection(db, "journalists"));
    console.log("Nombre de documents trouvés en direct:", querySnapshot.size);
    querySnapshot.forEach((doc) => console.log(doc.id, " => ", doc.data()));
  };
  testFirebase();
}, []);

  return (
    <List
      headerProps={{
        extra: (
          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {tableProps.dataSource?.length || 0} journalistes
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
          showTotal: (total) => `Total : ${total} journalistes`,
        }}
      >
        
        {/* Photo */}
        <Table.Column
          dataIndex="photoUrl"
          title="Photo"
          width={70}
          render={(value, record: any) => (
            <Image
              src={value}
              alt={record.name}
              width={50}
              height={60}
              style={{ 
                objectFit: 'cover', 
                borderRadius: 4,
                border: '1px solid #e8dcc8',
              }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6ZAAAASklEQVR42u3QMQEAAAiDMH+/6KFfWwAA4NkLrLiNiAACCCCCgEAAAsgAgEAAAsgAgEAAAsgAgEAAAsgAgEAAAsgAgEAA/QEEEQEAJQPBjQIGESkc0QAAAAASUVORK5CYII="
            />
          )}
        />
        
        {/* Nom */}
        <Table.Column
          dataIndex="name"
          title="Nom"
          width={150}
          render={(value) => (
            <Text strong style={{ color: '#2a2a2a' }}>
              {value}
            </Text>
          )}
          sorter
        />
        
        {/* Pays */}
        <Table.Column
          dataIndex="countryName"
          title="Pays"
          width={100}
          render={(value) => (
            <Badge 
              color="#c4a77d"
              text={<span style={{ color: '#666' }}>{value}</span>}
            />
          )}
          filters={tableProps.dataSource?.reduce((acc: any[], journalist: any) => {
            const existing = acc.find(f => f.value === journalist.countryName);
            if (!existing && journalist.countryName) {
              acc.push({
                text: journalist.countryName,
                value: journalist.countryName,
              });
            }
            return acc;
          }, []) || []}
          onFilter={(value, record: any) => record.countryName === value}
        />
        
        {/* Rôle */}
        <Table.Column
          dataIndex="role"
          title="Rôle"
          width={150}
          render={(value) => (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {value}
            </Text>
          )}
        />
        
        {/* Année */}
        <Table.Column
          dataIndex="yearOfDeath"
          title="Année"
          width={80}
          render={(value) => (
            <Text strong style={{ color: '#c4a77d' }}>
              † {value}
            </Text>
          )}
          sorter={(a: any, b: any) => (a.yearOfDeath || 0) - (b.yearOfDeath || 0)}
        />
        
        {/* Statut de publication */}
        <Table.Column
          dataIndex="isPublished"
          title="Statut"
          width={100}
          render={(value) => (
            <Badge
              status={value ? 'success' : 'processing'}
              text={value ? '✓ Publié' : '⊘ Brouillon'}
              color={value ? '#52c41a' : '#d9d9d9'}
            />
          )}
          filters={[
            { text: 'Publié', value: true },
            { text: 'Brouillon', value: false },
          ]}
          onFilter={(value, record: any) => record.isPublished === value}
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
                description={`Êtes-vous sûr de vouloir supprimer ${record.name} ? Cette action est irréversible.`}
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

export default JournalistList;