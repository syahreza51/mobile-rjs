import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Chip, Menu } from 'react-native-paper';
import { pickPhoto } from '../lib/image-picker';
import TableMobileView from './inspection/TableMobileView';
import { colors, radius, spacing } from '../theme';

const CHECKLIST_OPTIONS = ['Baik', 'Rusak', 'N/A'];

function evaluateFormula(expression, values, labelMap) {
  if (!expression) return '0';
  try {
    let finalExpression = expression;
    const variableRegex = /\{([^}]+)\}/g;
    let match;
    while ((match = variableRegex.exec(expression)) !== null) {
      const labelName = match[1];
      const targetId = labelMap?.[labelName];
      const val = parseFloat(values[targetId || ''] || 0) || 0;
      finalExpression = finalExpression.replace(match[0], String(val));
    }
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${finalExpression})`)();
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
      return '0';
    }
    return result.toFixed(2);
  } catch {
    return '0';
  }
}

function pickImage(onPicked) {
  pickPhoto(onPicked);
}

function FieldWrapper({ field, children }) {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.fieldLabel}>
        {field.label}
        {field.required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {children}
    </View>
  );
}

function TableField({ field, values, handleValueChange }) {
  const config = field.tableConfig || {
    columns: [],
    initialRows: 1,
    allowAddTable: true,
  };

  const rawValue = values[field.id];
  const tablesData =
    Array.isArray(rawValue) && Array.isArray(rawValue[0])
      ? rawValue
      : [
          Array.isArray(rawValue)
            ? rawValue
            : Array.from({ length: config.initialRows || 1 }, () => ({})),
        ];

  const addTable = () => {
    const newTable = Array.from(
      { length: config.initialRows || 1 },
      () => ({}),
    );
    handleValueChange(field.id, [...tablesData, newTable]);
  };

  const removeTable = tableIndex => {
    if (tablesData.length <= 1) return;
    handleValueChange(
      field.id,
      tablesData.filter((_, i) => i !== tableIndex),
    );
  };

  const handleCellChangeMulti = (tIdx, rIdx, colId, val) => {
    const newTables = [...tablesData];
    const newTable = [...newTables[tIdx]];
    newTable[rIdx] = { ...newTable[rIdx], [colId]: val };
    newTables[tIdx] = newTable;
    handleValueChange(field.id, newTables);
  };

  const addRowMulti = tIdx => {
    const newTables = [...tablesData];
    newTables[tIdx] = [...newTables[tIdx], {}];
    handleValueChange(field.id, newTables);
  };

  const deleteRowMulti = (tIdx, rIdx) => {
    const newTables = [...tablesData];
    newTables[tIdx] = newTables[tIdx].filter((_, i) => i !== rIdx);
    handleValueChange(field.id, newTables);
  };

  return (
    <FieldWrapper field={field}>
      {tablesData.map((tableRows, tableIndex) => (
        <TableMobileView
          key={tableIndex}
          config={config}
          tableRows={tableRows}
          tableIndex={tableIndex}
          canRemoveTable={tablesData.length > 1}
          onCellChange={(rIdx, colId, val) =>
            handleCellChangeMulti(tableIndex, rIdx, colId, val)
          }
          onDeleteRow={rIdx => deleteRowMulti(tableIndex, rIdx)}
          onAddRow={() => addRowMulti(tableIndex)}
          onRemoveTable={() => removeTable(tableIndex)}
        />
      ))}
      {config.allowAddTable !== false ? (
        <Button mode="outlined" icon="table-plus" onPress={addTable}>
          Tambah Kelompok Data
        </Button>
      ) : null}
    </FieldWrapper>
  );
}

function SelectField({ field, values, handleValueChange, withNote }) {
  const [visible, setVisible] = useState(false);
  const options = field.options || field.selectOptions || [];

  return withNote(
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button mode="outlined" onPress={() => setVisible(true)} style={styles.selectBtn}>
          {values[field.id] || field.placeholder || 'Pilih opsi'}
        </Button>
      }
    >
      {options.map((opt, idx) => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const value = typeof opt === 'string' ? opt : opt.value ?? opt.label;
        return (
          <Menu.Item
            key={`${value}-${idx}`}
            onPress={() => {
              handleValueChange(field.id, value);
              setVisible(false);
            }}
            title={label}
          />
        );
      })}
    </Menu>,
  );
}

export default function DynamicFieldRenderer({
  field,
  values,
  handleValueChange,
  labelMap,
}) {
  const withNote = content => (
    <FieldWrapper field={field}>
      {content}
      {field.allow_note && field.type !== 'photo' ? (
        <TextInput
          mode="outlined"
          dense
          placeholder="Catatan/temuan lapangan..."
          value={values[`${field.id}_note`] || ''}
          onChangeText={v => handleValueChange(`${field.id}_note`, v)}
          style={styles.noteInput}
        />
      ) : null}
    </FieldWrapper>
  );

  if (field.isDisplayPhoto === false && field.type === 'photo') {
    return null;
  }

  switch (field.type) {
    case 'number':
      return withNote(
        <TextInput
          mode="outlined"
          dense
          keyboardType="numeric"
          value={String(values[field.id] ?? '')}
          onChangeText={v => handleValueChange(field.id, v)}
          right={field.unit ? <TextInput.Affix text={field.unit} /> : null}
        />,
      );

    case 'textArea':
      return withNote(
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          value={String(values[field.id] ?? '')}
          onChangeText={v => handleValueChange(field.id, v)}
        />,
      );

    case 'select':
      return (
        <SelectField
          field={field}
          values={values}
          handleValueChange={handleValueChange}
          withNote={withNote}
        />
      );

    case 'formula': {
      const resultValue = evaluateFormula(
        field.formula_config?.expression,
        values,
        labelMap,
      );
      return withNote(
        <View>
          <TextInput mode="outlined" dense value={resultValue} editable={false} />
          <Text style={styles.formulaHint}>
            Rumus: {field.formula_config?.expression || '-'}
          </Text>
        </View>,
      );
    }

    case 'checklist':
      return withNote(
        <View style={styles.chipRow}>
          {CHECKLIST_OPTIONS.map(opt => (
            <Chip
              key={opt}
              selected={values[field.id] === opt}
              onPress={() => handleValueChange(field.id, opt)}
              style={styles.chip}
            >
              {opt}
            </Chip>
          ))}
        </View>,
      );

    case 'checkbox': {
      const selectedLabels =
        values[field.id] !== undefined
          ? values[field.id]
          : field.checkboxs
              ?.filter(item => item.status === true)
              .map(item => item.label) || [];

      return withNote(
        <View style={styles.checkboxGrid}>
          {field.checkboxs?.map((item, index) => {
            const isSelected = selectedLabels.includes(item.label);
            return (
              <TouchableOpacity
                key={`${item.label}-${index}`}
                style={[styles.checkboxItem, isSelected && styles.checkboxSelected]}
                onPress={() => {
                  const next = isSelected
                    ? selectedLabels.filter(l => l !== item.label)
                    : [...selectedLabels, item.label];
                  handleValueChange(field.id, next);
                }}
              >
                <Checkbox status={isSelected ? 'checked' : 'unchecked'} />
                <Text style={styles.checkboxLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>,
      );
    }

    case 'table':
      return (
        <TableField
          field={field}
          values={values}
          handleValueChange={handleValueChange}
        />
      );

    case 'photo':
      return withNote(
        <View>
          {values[field.id] ? (
            <View>
              <Image source={{ uri: values[field.id] }} style={styles.photoPreview} />
              <Button mode="text" onPress={() => handleValueChange(field.id, null)}>
                Hapus Foto
              </Button>
            </View>
          ) : (
            <View style={styles.photoActions}>
              <Button
                mode="outlined"
                icon="camera"
                onPress={() => pickImage(uri => handleValueChange(field.id, uri))}
              >
                Pilih Foto
              </Button>
            </View>
          )}
        </View>,
      );

    default:
      return withNote(
        <TextInput
          mode="outlined"
          dense
          value={String(values[field.id] ?? field.defaultValue ?? '')}
          onChangeText={v => handleValueChange(field.id, v)}
        />,
      );
  }
}

const styles = StyleSheet.create({
  fieldBox: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  fieldLabel: { fontWeight: '700', fontSize: 14, marginBottom: spacing.sm, color: colors.text },
  required: { color: colors.danger },
  noteInput: { marginTop: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { marginRight: 4, marginBottom: 4 },
  checkboxGrid: { gap: 4 },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxSelected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  checkboxLabel: { flex: 1, fontSize: 13 },
  photoPreview: { width: '100%', height: 180, borderRadius: radius.md, marginBottom: spacing.sm },
  photoActions: { flexDirection: 'row', gap: spacing.sm },
  formulaHint: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  selectBtn: { justifyContent: 'flex-start' },
});
