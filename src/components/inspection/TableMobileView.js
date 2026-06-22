import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import TableCellInput from './TableCellInput';
import { colors, radius, spacing } from '../../theme';

const ROW_BG = {
  GROUP: colors.surfaceMuted,
  SUB: colors.background,
};

function getFlatColumns(columns = []) {
  return columns.flatMap(col =>
    col.sub_columns?.length ? col.sub_columns : [col],
  );
}

export default function TableMobileView({
  config,
  tableRows,
  tableIndex,
  canRemoveTable,
  onCellChange,
  onDeleteRow,
  onAddRow,
  onRemoveTable,
}) {
  const flatColumns = getFlatColumns(config.columns || []);

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelompok Data #{tableIndex + 1}</Text>
        {canRemoveTable ? (
          <Button
            mode="text"
            textColor="#C8102E"
            compact
            icon="delete"
            onPress={onRemoveTable}
          >
            Hapus
          </Button>
        ) : null}
      </View>

      {tableRows.map((row, rowIndex) => {
        const rowType =
          config.rowConfig?.[`row_${rowIndex}_type`] || 'NORMAL';
        const rowBg =
          rowType === 'GROUP'
            ? ROW_BG.GROUP
            : rowType === 'SUB'
              ? ROW_BG.SUB
              : '#FFFFFF';

        return (
          <Surface
            key={rowIndex}
            style={[styles.rowCard, { backgroundColor: rowBg }]}
            elevation={0}
          >
            <View style={styles.rowHeader}>
              <Text style={styles.rowTitle}>Baris {rowIndex + 1}</Text>
              <IconButton
                icon="delete-outline"
                size={20}
                onPress={() => onDeleteRow(rowIndex)}
              />
            </View>

            {flatColumns.map(column => {
              const isMerged =
                config.rowConfig?.[`${rowIndex}_${column.id}`]?.merged;
              if (isMerged && rowType === 'NORMAL') return null;

              return (
                <View key={column.id} style={styles.cellBlock}>
                  <Text style={styles.cellLabel}>{column.label}</Text>
                  <View style={styles.cellInputWrap}>
                    <TableCellInput
                      type={column.type || 'text'}
                      value={row[column.id]}
                      onChange={val => onCellChange(rowIndex, column.id, val)}
                    />
                  </View>
                </View>
              );
            })}
          </Surface>
        );
      })}

      <Button mode="outlined" icon="plus" onPress={onAddRow} style={styles.addBtn}>
        Tambah Baris
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: { fontWeight: '800', fontSize: 13, color: colors.primary },
  rowCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rowTitle: { fontWeight: '800', fontSize: 13, color: colors.text },
  cellBlock: { marginBottom: 10 },
  cellLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  cellInputWrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    minHeight: 48,
    justifyContent: 'center',
  },
  addBtn: { marginTop: 4, borderRadius: radius.sm },
});
