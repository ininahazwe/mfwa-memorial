// ============================================
// LISTE DES JOURNALISTES
// ============================================
// Tableau avec photo, nom, pays, rôle, année, statut

import { 
  List, 
  useTable, 
  EditButton, 
  DeleteButton,
  TagField,
} from '@refinedev/antd';
import { Table, Space, Image, Switch, Typography } from 'antd';

const { Text } = Typography;

export const JournalistList = () => {
  // Hook Refine pour la gestion du tableau
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        
        {/* Photo */}
        <Table.Column
          dataIndex="photoUrl"
          title="Photo"
          width={80}
          render={(value) => (
            <Image
              src={value}
              alt="Portrait"
              width={50}
              height={60}
              style={{ 
                objectFit: 'cover', 
                borderRadius: 4,
                filter: 'grayscale(30%)',
              }}
              fallback="https://via.placeholder.com/50x60?text=?"
            />
          )}
        />
        
        {/* Nom */}
        <Table.Column
          dataIndex="name"
          title="Nom"
          render={(value) => <Text strong>{value}</Text>}
          sorter
        />
        
        {/* Pays */}
        <Table.Column
          dataIndex="countryName"
          title="Pays"
          render={(value) => (
            <TagField value={value} color="gold" />
          )}
        />
        
        {/* Rôle */}
        <Table.Column
          dataIndex="role"
          title="Rôle"
          render={(value) => <Text type="secondary">{value}</Text>}
        />
        
        {/* Année de disparition */}
        <Table.Column
          dataIndex="yearOfDeath"
          title="Année"
          width={100}
          render={(value) => <Text>†{value}</Text>}
          sorter
        />
        
        {/* Statut de publication */}
        <Table.Column
          dataIndex="isPublished"
          title="Publié"
          width={80}
          render={(value) => (
            <Switch 
              checked={value} 
              disabled 
              size="small"
              style={{ 
                backgroundColor: value ? '#c4a77d' : undefined 
              }}
            />
          )}
        />
        
        {/* Actions */}
        <Table.Column
          title="Actions"
          width={120}
          render={(_, record: any) => (
            <Space>
              <EditButton 
                hideText 
                size="small" 
                recordItemId={record.id} 
              />
              <DeleteButton 
                hideText 
                size="small" 
                recordItemId={record.id}
              />
            </Space>
          )}
        />
        
      </Table>
    </List>
  );
};

export default JournalistList;
