// ============================================
// LISTE DES PAYS
// ============================================
// Tableau avec nom, code ISO, coordonnées, niveau de risque

import { 
  List, 
  useTable, 
  EditButton, 
  DeleteButton,
  TagField,
} from '@refinedev/antd';
import { Table, Space, Typography } from 'antd';

const { Text } = Typography;

// Couleurs par niveau de risque
const riskColors: Record<string, string> = {
  high: 'gold',
  critical: 'orange',
  extreme: 'red',
};

// Labels en français
const riskLabels: Record<string, string> = {
  high: 'Élevé',
  critical: 'Critique',
  extreme: 'Extrême',
};

export const CountryList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        
        {/* Nom du pays */}
        <Table.Column
          dataIndex="name"
          title="Pays"
          render={(value) => <Text strong>{value}</Text>}
          sorter
        />
        
        {/* Code ISO */}
        <Table.Column
          dataIndex="code"
          title="Code ISO"
          width={100}
          render={(value) => (
            <Text code style={{ fontSize: 12 }}>{value}</Text>
          )}
        />
        
        {/* Coordonnées */}
        <Table.Column
          dataIndex="coords"
          title="Coordonnées"
          render={(value) => (
            value ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {value.lat.toFixed(2)}, {value.lng.toFixed(2)}
              </Text>
            ) : '-'
          )}
        />
        
        {/* Niveau de risque */}
        <Table.Column
          dataIndex="riskLevel"
          title="Niveau de risque"
          width={140}
          render={(value) => (
            <TagField 
              value={riskLabels[value] || value} 
              color={riskColors[value] || 'default'} 
            />
          )}
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
              {value}
            </Text>
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

export default CountryList;
