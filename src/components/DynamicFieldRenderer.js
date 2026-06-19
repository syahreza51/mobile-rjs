import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Chip } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';

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
  launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.7 }, res => {
    if (res.didCancel || res.errorCode) return;
    const asset = res.assets?.[0];
    if (!asset) return;
    const uri = asset.base64
      ? `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`
      : asset.uri;
    onPicked(uri);
  });
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
  const config = field.tableConfig || { columns: [], initialRows: 1 };
  const rawValue = values[field.id];
  const tableRows = Array.isArray(rawValue) && !Array.isArray(rawValue[0])
    ? rawValue
    : Array.isArray(rawValue?.[0])
      ? rawValue[0]
      : Array.from({ length: config.initialRows || 1 }, () => ({}));

  const updateCell = (rowIdx, colId, val) => {
    const newRows = [...tableRows];
    newRows[rowIdx] = { ...newRows[rowIdx], [colId]: val };
    handleValueChange(field.id, newRows);
  };

  const addRow = () => {
    handleValueChange(field.id, [...tableRows, {}]);
  };

  const flatColumns = config.columns.flatMap(col =>
    col.sub_columns?.length ? col.sub_columns : [col],
  );

  return (
    <FieldWrapper field={field}>
      {tableRows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Baris {rowIdx + 1}</Text>
          {flatColumns.map(col => (
            <TextInput
              key={col.id}
              mode="outlined"
              dense
              label={col.label}
              value={String(row[col.id] || '')}
              onChangeText={v => updateCell(rowIdx, col.id, v)}
              style={styles.tableInput}
              keyboardType={col.type === 'number' ? 'numeric' : 'default'}
            />
          ))}
        </View>
      ))}
      <Button mode="text" onPress={addRow} icon="plus">
        Tambah Baris
      </Button>
    </FieldWrapper>
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
              <Button mode="outlined" icon="camera" onPress={() => pickImage(uri => handleValueChange(field.id, uri))}>
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
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  fieldLabel: { fontWeight: '700', fontSize: 14, marginBottom: 8, color: '#1E293B' },
  required: { color: '#C8102E' },
  noteInput: { marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginRight: 4, marginBottom: 4 },
  checkboxGrid: { gap: 4 },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkboxSelected: { backgroundColor: '#DBEAFE', borderColor: '#2563EB' },
  checkboxLabel: { flex: 1, fontSize: 13 },
  photoPreview: { width: '100%', height: 180, borderRadius: 12, marginBottom: 8 },
  photoActions: { flexDirection: 'row', gap: 8 },
  formulaHint: { fontSize: 11, color: '#64748B', marginTop: 4 },
  tableRow: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableRowLabel: { fontWeight: '700', fontSize: 12, marginBottom: 8, color: '#0055A4' },
  tableInput: { marginBottom: 6 },
});
